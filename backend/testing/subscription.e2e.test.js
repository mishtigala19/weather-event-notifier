require('dotenv').config({ path: './testing/.env.test' });

jest.setTimeout(30000);

const request      = require('supertest');
const mongoose     = require('mongoose');
const app          = require('../app');
const Subscription = require('../models/Subscription');
const { generateSubscriptionBatch } = require('./testSubscriptionGenerator');

const MONGO_URI = process.env.MONGODB_URI;

beforeAll(async () => {
  console.log('Connecting to MongoDB…', MONGO_URI);
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
});

afterAll(async () => {
  console.log('Closing MongoDB connection');
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Subscription.deleteMany({});
});

describe('POST /subscribe', () => {
  it('should create a valid subscription', async () => {
    const payload = {
      email: 'testuser@example.com',
      phone: '+12345678901',
      location: {
        city: 'Boston',
        country: 'USA',
        coordinates: { lat: 42.3601, lon: -71.0589 }
      },
      alertTypes: ['rain'],
      notificationMethods: ['sms'],
      frequency: 'daily',
      timezone: 'America/New_York',
      checkInterval: 30,
      alertCooldown: 60,
      quietHours: { start: '22:00', end: '07:00' }
    };

    const response = await request(app)
      .post('/subscribe')
      .send(payload)
      .expect(201);

    expect(response.body).toHaveProperty('message', 'Subscription saved!');
    expect(response.body.subscription.email).toBe(payload.email);

    const subInDb = await Subscription.findOne({ email: payload.email });
    expect(subInDb).not.toBeNull();
    expect(subInDb.phone).toBe(payload.phone);
  });

  it('should reject invalid email', async () => {
    const payload = {
      email: 'not-an-email',
      phone: '+12345678901',
      location: { city: 'Boston' },
      alertTypes: ['rain'],
      notificationMethods: ['email']
    };

    const response = await request(app)
      .post('/subscribe')
      .send(payload)
      .expect(400);

    expect(response.body.errors).toContain('Invalid email address');
  });

  it('should submit and verify all generated subscriptions', async () => {
    const subscriptions = generateSubscriptionBatch(5);

    for (const payload of subscriptions) {
      const response = await request(app)
        .post('/subscribe')
        .send(payload)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Subscription saved!');
      expect(response.body.subscription.email).toBe(payload.email);

      const subInDb = await Subscription.findOne({ email: payload.email });
      expect(subInDb).not.toBeNull();
      expect(subInDb.phone).toBe(payload.phone);
      expect(subInDb.location.city).toBe(payload.location.city);
    }

    const total = await Subscription.countDocuments();
    expect(total).toBe(subscriptions.length);
  });
});
