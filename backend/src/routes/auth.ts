import { Router } from 'express';

const router = Router();

// Mock User DB
const users = [
  { id: 1, email: 'demo@groww.in', name: 'Demo User' }
];

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  // Simple mock: accept anything unless it's explicitly broken
  res.json({
    success: true,
    data: {
      token: 'mock-jwt-token-1234567890',
      user: {
        id: Math.floor(Math.random() * 1000),
        email: email,
        name: email.split('@')[0]
      }
    }
  });
});

router.post('/signup', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  res.json({
    success: true,
    data: {
      token: 'mock-jwt-token-0000000',
      user: {
        id: Math.floor(Math.random() * 1000),
        email: email,
        name: email.split('@')[0]
      }
    }
  });
});

export default router;
