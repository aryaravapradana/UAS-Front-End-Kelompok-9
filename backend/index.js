require('dotenv').config();
const express = require('express');
// const cors = require('cors'); // Removed unused dependency
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT || 3001;

// Manual CORS Middleware - The "Nuclear Option" with Logging
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`🔥 [CORS] Request: ${req.method} ${req.url}`);
  console.log(`🔥 [CORS] Origin: ${origin}`);
  
  // Blindly reflect the origin if it exists
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log(`✅ [CORS] Set Access-Control-Allow-Origin: ${origin}`);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log(`⚠️ [CORS] No origin, set Access-Control-Allow-Origin: *`);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight requests directly
  if (req.method === 'OPTIONS') {
    console.log(`✅ [CORS] Handling OPTIONS preflight`);
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

const authRoutes = require('./routes/auth.routes.js');
const lombaRoutes = require('./routes/lomba.routes.js');
const beasiswaRoutes = require('./routes/beasiswa.routes.js');
const talkRoutes = require('./routes/talk.routes.js');
const bootcampRoutes = require('./routes/bootcamp.routes.js');
const memberRoutes = require('./routes/member.routes.js');
const userRoutes = require('./routes/user.routes.js');
const notificationRoutes = require('./routes/notification.routes.js'); // Import notification routes
const lombaRegistrationRoutes = require('./routes/lomba_registration.js'); // Import lomba registration routes
const eventDetailsRoutes = require('./routes/event_details.js'); // Import event details routes

app.use('/api/auth', authRoutes);
app.use('/api/lombas', lombaRoutes);
app.use('/api/lombas', lombaRegistrationRoutes); // Use lomba registration routes
app.use('/api/events', eventDetailsRoutes); // Use event details routes
app.use('/api/beasiswas', beasiswaRoutes);
app.use('/api/talks', talkRoutes);
app.use('/api/bootcamps', bootcampRoutes);
app.use('/api', memberRoutes);
app.use('/api', userRoutes);
app.use('/api/notifications', notificationRoutes); // Use notification routes

// Root route handler
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend is running!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Handler - Always return JSON
app.use((req, res) => {
  console.log(`⚠️ [404] Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Global Error Handler - Always return JSON
app.use((err, req, res, next) => {
  console.error(`❌ [500] Global error:`, err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Error handling for server startup
const server = app.listen(PORT, () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port;
  console.log(`✅ Server is running on ${bind}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL || 'not set'}`);
  console.log(`✅ Database: ${process.env.DATABASE_URL ? 'connected' : 'not set'}`);
}).on('error', (err) => {
  console.error('❌ Server startup error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Catch unhandled rejections (e.g. failed DB connection)
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  // process.exit(1); // Optional: restart container
});
