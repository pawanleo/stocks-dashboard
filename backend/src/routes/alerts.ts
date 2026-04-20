import { Router } from 'express';
import { createAlert, deleteAlert, listAlerts } from '../services/alertService';

const router = Router();

/**
 * GET /api/alerts?symbol=AAPL
 * List all alerts, optionally filtered by ticker symbol
 */
router.get('/', (req, res) => {
  const symbol = req.query.symbol as string | undefined;
  res.json({
    success: true,
    data: listAlerts(symbol)
  });
});

/**
 * POST /api/alerts
 * Create a new price threshold alert
 * Body: { symbol: string, targetPrice: number, direction: 'above' | 'below' }
 */
router.post('/', (req, res) => {
  const { symbol, targetPrice, direction } = req.body;

  if (!symbol || targetPrice === undefined || !direction) {
    return res.status(400).json({
      success: false,
      message: 'symbol, targetPrice, and direction (above/below) are required'
    });
  }

  if (!['above', 'below'].includes(direction)) {
    return res.status(400).json({
      success: false,
      message: 'direction must be "above" or "below"'
    });
  }

  if (typeof targetPrice !== 'number' || targetPrice <= 0) {
    return res.status(400).json({
      success: false,
      message: 'targetPrice must be a positive number'
    });
  }

  const alert = createAlert(symbol, targetPrice, direction);
  res.status(201).json({
    success: true,
    data: alert
  });
});

/**
 * DELETE /api/alerts/:id
 * Delete an alert by ID
 */
router.delete('/:id', (req, res) => {
  const deleted = deleteAlert(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Alert not found' });
  }
  res.json({ success: true, message: 'Alert deleted' });
});

export default router;
