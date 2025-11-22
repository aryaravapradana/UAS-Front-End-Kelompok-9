require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// CORS configuration - PERMISSIVE MODE for troubleshooting
app.use(cors({
  origin: true, // Reflects the request origin, allowing all
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
  maxAge: 86400 // 24 hours
}));

// app.options('/:path(*)', cors()); // Removed explicit pre-flight, let cors middleware handle it

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

const PORT = process.env.PORT || 3001;

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling for server startup
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`);
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
