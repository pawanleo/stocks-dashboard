import { Router } from 'express';
import { getAvailableTickers, getHistoricalData } from '../services/marketData';

const router = Router();

// Get list of all available tickers with their latest state
router.get('/tickers', (req, res) => {
  res.json({
    success: true,
    data: getAvailableTickers()
  });
});

// Get historical chart data for a specific ticker
router.get('/tickers/:symbol/history', (req, res) => {
  const { symbol } = req.params;
  const dataPoints = req.query.points ? parseInt(req.query.points as string) : 50;
  
  const history = getHistoricalData(symbol.toUpperCase(), dataPoints);
  
  if (history.length === 0) {
    return res.status(404).json({ success: false, message: 'Ticker not found' });
  }

  res.json({
    success: true,
    data: history
  });
});

export default router;
