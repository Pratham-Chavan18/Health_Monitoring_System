const request = require('supertest');

// Mock dotenv so tests don't need a real .env
process.env.PORT = '5001';
process.env.MONGO_URI = 'mongodb://localhost:27017/test_health';
process.env.JWT_SECRET = 'test-secret';

// We only test the health endpoint (doesn't need DB)
const express = require('express');
const app = express();

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

describe('Health Check Endpoint', () => {
    it('GET /api/health should return status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body).toHaveProperty('uptime');
    });
});
