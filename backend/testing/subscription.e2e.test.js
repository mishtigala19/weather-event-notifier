const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Subscription = require('../models/Subscription');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /subscribe', () => {
  it('should create a valid subscription', async () => {
    const payload = {
      email: 'testuser@example.com',
      phone: '+12345678901',
      location: 'Boston',
      alertType: 'Rain',
      frequency: 'recurring',
      preferredDate: new Date().toISOString()
    };

    const response = await request(app)
      .post('/subscribe')
      .send(payload)
      .expect(201);

    expect(response.body).toHaveProperty('message', 'Subscription saved!');
    expect(response.body.subscription).toHaveProperty('email', payload.email);

    // Check DB directly
    const sub = await Subscription.findOne({ email: payload.email });
    expect(sub).not.toBeNull();
    expect(sub.phone).toBe(payload.phone);
  });

  it('should reject invalid email', async () => {
    const response = await request(app)
      .post('/subscribe')
      .send({ email: 'bademail', phone: '+12345678901' })
      .expect(400);

    expect(response.body.errors).toContain('Invalid email address');
  });
});
