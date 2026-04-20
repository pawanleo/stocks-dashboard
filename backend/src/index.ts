import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import apiRoutes from './routes/api';
import authRoutes from './routes/auth';
import alertRoutes from './routes/alerts';
import { simulateMarketTick, getAvailableTickers } from './services/marketData';
import { checkAlerts } from './services/alertService';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// REST Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send initial data immediately upon connection
  socket.emit('market_init', getAvailableTickers());

  // Handle subscription to specific ticker (bonus/optional for optimization, 
  // but for a dashboard we might just broadcast all updates or specific to rooms)
  socket.on('subscribe', (symbol: string) => {
    console.log(`Client ${socket.id} subscribed to ${symbol}`);
    socket.join(symbol);
  });

  socket.on('unsubscribe', (symbol: string) => {
    socket.leave(symbol);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start simulating market ticks and broadcast
const TICK_INTERVAL_MS = 1000; // 1 update per second
setInterval(() => {
  const updates = simulateMarketTick();
  if (updates.length > 0) {
    // Broadcast all updates to everyone.
    // In a massive app, we'd emit to specific `socket.to(symbol)` rooms.
    io.emit('market_update', updates);

    // --- Price threshold alerting ---
    const currentPrices = new Map<string, number>();
    updates.forEach(u => currentPrices.set(u.symbol, u.price));
    const triggeredAlerts = checkAlerts(currentPrices);
    if (triggeredAlerts.length > 0) {
      io.emit('price_alert', triggeredAlerts);
    }
  }
}, TICK_INTERVAL_MS);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
