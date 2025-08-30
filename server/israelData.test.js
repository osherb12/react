import request from 'supertest';
import express from 'express';
import israelDataRouter from './routes/israelData.js';

const app = express();
app.use('/israel-data', israelDataRouter);

describe('GET /israel-data/cities', () => {
  it('should return a list of cities', async () => {
    const response = await request(app).get('/israel-data/cities');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('result.records');
    expect(Array.isArray(response.body.result.records)).toBe(true);
  });
});

describe('GET /israel-data/streets', () => {
  it('should return a list of streets for a valid city code', async () => {
    const response = await request(app).get('/israel-data/streets?cityCode=5000');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('result.records');
    expect(Array.isArray(response.body.result.records)).toBe(true);
  });

  it('should return a 400 error if cityCode is not provided', async () => {
    const response = await request(app).get('/israel-data/streets');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'City code is required.');
  });
});
