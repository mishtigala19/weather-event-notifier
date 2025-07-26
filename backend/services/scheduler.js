const cron = require('node-cron');
const moment = require('moment-timezone');
const Subscription = require('../models/Subscription');
const weatherService = require('./weatherService');
const eventDetector = require('./eventDetector');
const emailService = require('./emailService');
const smsService = require('./smsService');


class WeatherScheduler {
    constructor() {
        this.isRunning = false;
        this.jobCount = 0;
    }

    // Start the main periodic checks
    startPeriodicChecks() {
        if (this.isRunning) {
            console.log('⚠️ Scheduler already running');
            return;
        }
        
        // Every 30 min
        this.mainJob = cron.schedule('*/30 * * * *', async () => {
            console.log(`🕐 [${new Date().toISOString()}] Running scheduled weather check #${++this.jobCount}`);
            await this.checkAllSubscriptions();
        }, {
            scheduled: false // Don't start right away
        });

        this.mainJob.start();
        this.isRunning = true;
        console.log('✅ Weather scheduler initialized and started.');
    }

    // Main method to check all active subs
    async checkAllSubscriptions() {
        try {
            // Find all active subs that need checking
            const subscriptions = await Subscription.find({
                isActive: true,
                $or: [
                    { lastChecked: null }, // never checked before
                    {
                        lastChecked: {
                            $lt: new Date(Date.now() - 30 * 60 * 1000) // Last checked > 30 min ago
                        }
                    }
                ]
            });

            console.log(`📊 Found ${subscriptions.length} subscriptions to check`);

            let alertsSent = 0;
            for (const subscription of subscriptions) {
                try {
                    const alertSent = await this.checkSubscription(subscription);
                    if (alertSent) alertsSent++;
                } catch (error) {
                    console.error(`❌ Error checking subscription ${subscription._id}:`, error.message);
                }
            }

            console.log(`✅ Completed check: ${alertsSent} alerts sent out of ${subscriptions.length} subscriptions`);
        } catch (error) {
            console.error('❌ Error in checkAllSubscriptions:', error.message);
        }
    }

    // Get for a single subsciption
    async checkSubscription(subscription) {
        try {

            const { location, alertTypes, timezone, quietHours, alertCooldown, lastNotified } = subscription;

            // Skip if in quiet hours
            if (this.isInQuietHours(timezone, quietHours)) {
                console.log(`🔇 Skipping ${subscription.email} - in quiet hours`);
                await this.updateLastChecked(subscription._id);
                return false;
            }

            // Skip if still in cooldown period
            if (this.isInCooldown(lastNotified, alertCooldown)) {
                console.log(`⏱️ Skipping ${subscription.email} - in cooldown period`);
                await this.updateLastChecked(subscription._id);
                return false;
            }

            // Get current weather for user's location
            const weatherData = await weatherService.getWeatherByCity(location.city);
            if (!weatherData.success) {
                console.error(`❌ Failed to get weather for ${location.city}:`, weatherData.error);
                await this.updateLastChecked(subscription._id);
                return false;
            }

            // Check for events
            const detector = new eventDetector.EventDetector();
            const events = detector.detectEvents(weatherData.data);

            // Find matching alerst
            const matchingAlerts = events.filter(event =>
                alertTypes.includes(event.type.toLowerCase())
            );

            if (matchingAlerts.length > 0) {
                console.log(`🚨 Found ${matchingAlerts.length} matching alerts for ${subscription.email}`);
                await this.sendAlerts(subscription, matchingAlerts, weatherData.data);
                await this.updateLastNotified(subscription._id);
                await this.updateLastChecked(subscription._id);
                return true;
            } else {
                // No alerts, just update last checked
                await this.updateLastChecked(subscription._id);
                return false;
            }

        } catch (error) {
            console.error(` Error checking subscription ${subscription._id}:`, error.message);
            // Still update lastChecked to prevent stuck subscriptions
            await this.updateLastChecked(subscription._id);
            return false;
        }
        
    }

    // Send alerts via email/SMS
    async sendAlerts(subscription, alerts, weatherData) {
        const { email, phone, notificationMethods, location } = subscription;

        for (const method of notificationMethods) {
            try {
                if (method === 'email' && email) {
                    await this.sendEmailAlert(email, alerts, weatherData, location);
                    console.log(`📧 Email alert sent to ${email}`);
                }

                if (method === 'sms' && phone) {
                    await this.sendSMSAlert(phone, alerts, weatherData, location);
                    console.log(`📱 SMS alert sent to ${phone}`);
                }
            } catch (error) {
                console.error(`❌ Failed to send ${method} alert:`, error.message);
            }
        }
    }


    // Send email alert
    async sendEmailAlert(email, alerts, weatherData, location) {
        const alertList = alerts.map(alert =>
            `• ${alert.type.toUpperCase()}: ${alert.message}`
        ).join('\n');

        const subject = `Weather Alert for ${location.city}`;
        const message = `
Weather Alert for ${location.city}

Current Conditions:
• Temperature: ${Math.round(weatherData.main.temp - 273.15)}°C
• Weather: ${weatherData.weather[0].description}

Active Alerts:
${alertList}

---
This is an automated alert from Weather Event Notifier.
To unsubscribe, visit: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe
        `.trim();

        await emailService.sendEmail(email, subject, message);
    }

    // Send SMS alert
    async sendSMSAlert(phone, alerts, weatherData, location) {
        const temp = Math.round(weatherData.main.temp - 273.15);
        const alertTypes = alerts.map(a => a.type.toUpperCase()).join(', ');

        const message = `Weather Alert for ${location.city}: ${alertTypes}. Current: ${temp}°C, ${weatherData.weather[0].description}. Unsubscribe: ${process.env.FRONTEND_URL || 'localhost:3000'}/unsubscribe`;

        await smsService.sendSMS(phone, message);
    }

    // Checks if current time is in the user's quiet hours
    isInQuietHours(timezone, quietHours) {
        if (!quietHours || !quietHours.start || !quietHours.end) return false;

        const now = moment().tz(timezone);
        const currentTime = now.format('HH:mm');

        const { start, end } = quietHours;

        // Handle overnight quiet hours
        if (start > end) {
            return currentTime >= start || currentTime <= end; 
        } else {
            return currentTime >= start && currentTime <= end;
        }
    }

    // Check if subscription is still in cooldown period
    isInCooldown(lastNotified, alertCooldown) {
        if (!lastNotified || !alertCooldown) return false;

        const cooldownMs = alertCooldown * 60 * 1000; // Convert mins to milliseconds
        const timeSinceLastAlert = Date.now() - new Date(lastNotified).getTime();

        return timeSinceLastAlert < cooldownMs;
    }

    // Update lastChecked timestamp
    async updateLastChecked(subscriptionId) {
        await Subscription.findByIdAndUpdate(subscriptionId, {
            lastChecked: new Date()
        });
    }

    // Update lastNotified timestamp
    async updateLastNotified(subscriptionId) {
        await Subscription.findByIdAndUpdate(subscriptionId, {
            lastNotified: new Date()
        });
    }

    // Stop the scheduler
    stop() {
        if (this.mainJob) {
            this.mainJob.stop();
            this.isRunning = false;
            console.log('🛑 Weather scheduler stopped');
        }
    }

    // Get scheduler status
    getStatus() {
        return {
            isRunning: this.isRunning,
            jobCount: this.jobCount,
            nextRun: this.mainJob ? 'Every 30 minutes' : 'Not scheduled'
        };
    }
}

module.exports = WeatherScheduler;