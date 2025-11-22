require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT || 3001;

// Manual CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`🔥 [CORS] Request: ${req.method} ${req.url}`);
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
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
const notificationRoutes = require('./routes/notification.routes.js');
const lombaRegistrationRoutes = require('./routes/lomba_registration.js');
const eventDetailsRoutes = require('./routes/event_details.js');

app.use('/api/auth', authRoutes);
app.use('/api/lombas', lombaRoutes);
app.use('/api/lombas', lombaRegistrationRoutes);
app.use('/api/events', eventDetailsRoutes);
app.use('/api/beasiswas', beasiswaRoutes);
app.use('/api/talks', talkRoutes);
app.use('/api/bootcamps', bootcampRoutes);
app.use('/api', memberRoutes);
app.use('/api', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route handler
app.get('/', (req, res) => {
  console.log('✅ [ROOT] Hit root endpoint');
  res.json({ 
    message: 'Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Add health check endpoint
app.get('/health', (req, res) => {
  console.log('✅ [HEALTH] Hit health endpoint');
  res.status(200).json({ status: 'ok' });
});

// 404 Handler
app.use((req, res) => {
  console.log(`⚠️ [404] Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`❌ [500] Global error:`, err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start Server
const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`✅ Server is running on port ${PORT} (0.0.0.0)`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL || 'not set'}`);
  
  // Test Database Connection Immediately
  try {
    console.log('🔄 Testing Database Connection...');
    await prisma.$connect();
    console.log('✅ Database: CONNECTED SUCCESSFULLY');
    
    // Optional: Run a simple query to be 100% sure
    const count = await prisma.member.count();
    console.log(`✅ Database Check: Found ${count} members`);
  } catch (error) {
    console.error('❌ FATAL: Database Connection Failed!');
    console.error(error);
    // We don't exit here so the logs can be read, but the app is effectively broken
  }

}).on('error', (err) => {
  console.error('❌ Server startup error:', err);
  process.exit(1);
});

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
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});
