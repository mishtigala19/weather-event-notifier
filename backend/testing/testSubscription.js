const axios = require('axios');

// Generate random email
function getRandomEmail() {
    const domains = ['example.com', 'testmail.com', 'weatheralerts.io'];
    const name = Math.random().toString(36).substring(2, 10);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${name}@${domain}`;
}

// Generate random phone number (US-style)
function getRandomPhone() {
    return '+1' + Math.floor(1000000000 + Math.random() * 9000000000);
}

// Generate random alert type
function getRandomAlertType() {
    const types = ['Rain', 'Heat', 'Storm', 'Snow'];
    return types[Math.floor(Math.random() * types.length)];
}

// Generate random location
function getRandomCity() {
    const cities = ['Boston', 'New York', 'Chicago', 'Miami', 'Seattle'];
    return cities[Math.floor(Math.random() * cities.length)];
}

// Generate random date in ISO format (within next 10 days)
function getRandomDate() {
    const now = new Date();
    const future = new Date(now.getTime() + Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000));
    return future.toISOString();
}

// Construct random subscription payload
function generateRandomSubscription() {
    return {
        email: getRandomEmail(),
        phone: getRandomPhone(),
        location: getRandomCity(),
        alertType: getRandomAlertType(),
        frequency: 'recurring',
        preferredDate: getRandomDate()
    };
}

// Send POST request to your backend
async function submitRandomSubscription() {
    const payload = generateRandomSubscription();
    try {
        const response = await axios.post('http://localhost:5001/subscribe', payload);
        console.log('Subscription successful:', response.data.subscription);
    } catch (error) {
        console.error('Subscription failed:', error.response?.data || error.message);
    }
}

// Run multiple submissions
(async () => {
    const count = 5; // Number of test submissions
    for (let i = 0; i < count; i++) {
        await submitRandomSubscription();
    }
})();
