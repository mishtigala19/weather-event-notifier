// Generate Random User Date: Count 5
function getRandomEmail() {
  const domains = ['example.com', 'testmail.com', 'weatheralerts.io'];
  const name = Math.random().toString(36).substring(2, 10);
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${name}@${domain}`;
}

function getRandomPhone() {
  return '+1' + Math.floor(1000000000 + Math.random() * 9000000000);
}

function getRandomCity() {
  const cities = ['Boston', 'New York', 'Chicago', 'Miami', 'Seattle'];
  return cities[Math.floor(Math.random() * cities.length)];
}

function getRandomAlertType() {
  const types = ['rain', 'heat', 'storm', 'snow', 'wind'];
  return types[Math.floor(Math.random() * types.length)];
}

function getRandomMethod() {
  const methods = ['email', 'sms'];
  return [methods[Math.floor(Math.random() * methods.length)]];
}

function generateRandomSubscription() {
  return {
    email: getRandomEmail(),
    phone: getRandomPhone(),
    location: {
      city: getRandomCity(),
      country: 'USA',
      coordinates: {
        lat: 40 + Math.random() * 10,
        lon: -80 + Math.random() * 10
      }
    },
    alertTypes: [getRandomAlertType()],
    notificationMethods: getRandomMethod(),
    frequency: 'once',
    timezone: 'America/New_York',
    checkInterval: 30,
    alertCooldown: 60,
    quietHours: { start: '22:00', end: '07:00' }
  };
}

function generateSubscriptionBatch(count = 5) {
  return Array.from({ length: count }, () => generateRandomSubscription());
}

module.exports = { generateSubscriptionBatch };
