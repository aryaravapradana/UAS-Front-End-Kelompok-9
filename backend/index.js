require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL || 'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow localhost and Vercel deployments
    if (allowedOrigins.indexOf(origin) !== -1 || (origin && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
