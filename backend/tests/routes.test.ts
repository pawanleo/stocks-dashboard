import express from 'express';
import request from 'supertest';
import apiRoutes from '../src/routes/api';
import authRoutes from '../src/routes/auth';
import alertRoutes from '../src/routes/alerts';

// Create a test app instance
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);

describe('API Routes', () => {
  describe('GET /api/tickers', () => {
    it('should return a list of tickers', async () => {
      const res = await request(app).get('/api/tickers');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('symbol');
      expect(res.body.data[0]).toHaveProperty('price');
    });
  });

  describe('GET /api/tickers/:symbol/history', () => {
    it('should return historical data for a valid ticker', async () => {
      const res = await request(app).get('/api/tickers/AAPL/history');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0]).toHaveProperty('timestamp');
      expect(res.body.data[0]).toHaveProperty('price');
    });

    it('should return 404 for an invalid ticker', async () => {
      const res = await request(app).get('/api/tickers/INVALID/history');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should accept custom data points count', async () => {
      const res = await request(app).get('/api/tickers/AAPL/history?points=10');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(11); // 10 + 1 latest
    });
  });
});

describe('Auth Routes', () => {
  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'demo@groww.in', password: 'groww123' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe('demo@groww.in');
    });

    it('should return 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'test' });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('required');
    });

    it('should return 400 when password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com' });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/signup', () => {
    it('should create an account successfully', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'new@user.com', password: 'password123' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('new@user.com');
      expect(res.body.data).toHaveProperty('token');
    });

    it('should return 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ password: 'test' });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});

describe('Alert Routes', () => {
  let createdAlertId: string;

  describe('POST /api/alerts', () => {
    it('should create a new alert', async () => {
      const res = await request(app)
        .post('/api/alerts')
        .send({ symbol: 'AAPL', targetPrice: 200, direction: 'above' });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.symbol).toBe('AAPL');
      createdAlertId = res.body.data.id;
    });

    it('should return 400 for missing fields', async () => {
      const res = await request(app)
        .post('/api/alerts')
        .send({ symbol: 'AAPL' });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid direction', async () => {
      const res = await request(app)
        .post('/api/alerts')
        .send({ symbol: 'AAPL', targetPrice: 200, direction: 'sideways' });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for negative price', async () => {
      const res = await request(app)
        .post('/api/alerts')
        .send({ symbol: 'AAPL', targetPrice: -50, direction: 'above' });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/alerts', () => {
    it('should list all alerts', async () => {
      const res = await request(app).get('/api/alerts');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter alerts by symbol', async () => {
      // Create a specific alert first
      await request(app)
        .post('/api/alerts')
        .send({ symbol: 'NVDA', targetPrice: 500, direction: 'above' });

      const res = await request(app).get('/api/alerts?symbol=NVDA');
      expect(res.status).toBe(200);
      expect(res.body.data.every((a: any) => a.symbol === 'NVDA')).toBe(true);
    });
  });

  describe('DELETE /api/alerts/:id', () => {
    it('should delete an existing alert', async () => {
      // Create one first
      const createRes = await request(app)
        .post('/api/alerts')
        .send({ symbol: 'TSLA', targetPrice: 300, direction: 'below' });
      
      const id = createRes.body.data.id;
      const res = await request(app).delete(`/api/alerts/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 for non-existent alert', async () => {
      const res = await request(app).delete('/api/alerts/non-existent');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
