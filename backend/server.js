require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Middleware ---------------
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// --------------- Health Check ---------------
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// --------------- Routes ---------------
// Keep backward-compatible routes (signup/login at root)
// AND proper RESTful routes under /api
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);

// Backward-compatible routes for existing frontend
app.use('/', authRoutes);        // /signup, /login
app.use('/patients', patientRoutes); // /patients/*

// --------------- Error Handling ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
async function startServer() {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
}

startServer();

module.exports = app; // Export for testing
