class EventDetector {
    constructor() {
        console.log('Event Detector initialized');
    }

    /**
     * Detect weather events from formatted weather data
     * @param {Object} weatherData - Formatted weather data from weatherService
     * @returns {Array} Arry of detected events
     */

    detectEvents(weatherData) {
        const events = []

        if (!weatherData || !weatherData.current) {
            console.error('Invalid weather data provided');
            return events;
        }

        const { temperature, main, description, windSpeed, humidity } = weatherData.current;


        // Heat Detection
        const heatEvent = this.detectHeatEvent(temperature);
        if (heatEvent) events.push(heatEvent);


        // Rain Detection
        const rainEvent = this.detectRainEvent(main, description);
        if (rainEvent) events.push(rainEvent);


        // Storm Detection
        const stormEvent = this.detectStormEvent(main, description, windSpeed);
        if (stormEvent) events.push(stormEvent);

        
        console.log('Detected ${events.length} weather events for ${weatherData.location.name}');
        return events;
    }


    /**
     * Detecting heat-related weather events
     * @param {number} temperature - Temp in celcius
     * @returns {Object|null} Heat event or null
     */

    detectHeatEvent(temperature) {
        if (temperature >= 40) {
            return {
                type: 'heat',
                severity: 'extreme',
                title: 'Extreme Heat Warning',
                description: 'Dangerous heat conditions with temperature at ${temperature}°C',
                temperature: temperature,
                reccomendations: [
                    'Stay indoords during peak hours',
                    'Drink plenty of water',
                    'Avoid strenuous outdoor activities'
                ]
            };
        } else if (temperature >= 35) {
            return {
                type: 'heat',
                severity: 'high',
                title: 'Heat Advisory',
                description: 'High temperature warning at ${temperature}°C',
                temperature: temperature,
                reccomendations: [
                    'Take frequent breaks in the shade',
                    'Stay hydrated',
                    'Wear light-colored clothing'
                ]
            };
        } else if (temperature >= 30) {
            return {
                type: 'heat',
                severity: 'moderate',
                title: 'Warm Weather Alert',
                description: 'Warm conditions at ${temperature}°C',
                temperature: temperature,
                reccomendations: [
                    'Stay hydrated',
                    'Seek shade when possible'
                ]
            };
        }

        return null;
    }


    /**
     * Detecting rain-related weather events
     * @param {string} main - Main weather condition
     * @param {string} description - Detailed weather description
     * @returns {Object|null} Rain event or null
     */

    detectRainEvent(main, description) {
        if (main === 'Rain' || main === 'Drizzle') {
            let severity = 'light';
            let title = 'Light rain';
            let reccomendations = ['Carry an umbrella', 'Drive carefully'];

            // Determine severity based on description
            const lowerDesc = description.toLowerCase();

            if (lowerDesc.includes('heavy') || lowerDesc.includes('intense')) {
                severity = 'heavy';
                title = 'Heavy Rain Warning';
                reccomendations = [
                    'Avoid driving if possible',
                    'Stay indoors',
                    'Watch for flooding',
                    'Carry rain gear'
                ];
            } else if (lowerDesc.includes('moderate')) {
                severity = 'moderate'
                title = 'Moderate Rain Alert';
                reccomendations = [
                    'Carry rain gear',
                    'Allow extra travel time',
                    'Drive with caution'
                ];
            }

            return {
                type: 'rain',
                severity: serverity,
                title: title,
                description: '${description.charAt(0).toUpperCase() + description.slice(1)} expected',
                weatherCondition: main,
                reccomendations: reccomendations
            };
        }

        return null;
    }


    /**
     * Detecting storm-related weather events
     * @param {string} main - Main weather condition
     * @param {string} description - Detailed weather description
     * @param {number} windSpeed - Wind speed in m/s
     * @returns {Object|null} Storm event or null
     */

    detectStormEvent(main, description, windSpeed) {
        const isThunderstorm = main === 'Thunderstorm';
        const isHighWind = windSpeed > 10; 

        if (isThunderstorm || isHighWind) {
            let severity = 'moderate';
            let title = 'Storm Alert';
            let reccomendations = [
                'Stay indoors',
                'Avoid open areas',
                'Unplug electronics'
            ];

            // Determining severity
            if (isThunderstorm && windSpeed > 15) {
                severity = 'severe';
                title = 'Severe Thunderstorm Warning';
                reccomendations = [
                    'Seek immediate shelter',
                    'Avoid windows',
                    'Stay away from electric equipment',
                    'Do not go outside',
                    'Monitor weather updates'
                ];
            } else if (windSpeed > 20) {
                severity = 'severe';
                title = 'High Wind Warning';
                reccomendations = [
                    'Secure outdoor items',
                    'Avoid driving high-profile vehicles',
                    'Stay away from trees and power lines',
                    'Postpone outdoor activities'
                ];
            }

            return {
                type: 'storm',
                severity: severity,
                title: title,
                description: '${description.charAt(0).toUpperCase() + description.slice(1)} with wind speed ${windSpeed} m/s',
                weatherCondition: main, 
                windSpeed: windSpeed,
                reccomendations: reccomendations
            };
        }

        return null;
    }


    /**
     * Get event summary for a location
     * @param {Object} weatherData - Formatted weather data
     * @returns {Object} Event summary
     */

    getEventSummary(weatherData) {
        const events = this.detectEvents(weatherData);

        const summary = {
            location: weatherData.location.name,
            timestamp: weatherData.timestamp,
            totalEvents: event.length,
            events: events,
            alerts: {
                heat: events.filter(e => e.type === 'heat').length,
                rain: events.filter(e => e.type === 'rain').length,
                storm: events.filter(e => e.type === 'storm').length
            }
        };

        return summary
    }
}

module.exports = new EventDetector();