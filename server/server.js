// server.js
require('dotenv').config(); // ✅ Load env vars FIRST

const express = require('express');
const cors = require('cors');

// Import custom modules
const connectDB = require('./config/db');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Route imports
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const reportRoutes = require('./routes/reportRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/reports', reportRoutes);


// Default Route
app.get('/', (req, res) => {
  res.send('Payroll Management Backend API is running ✅');
});

// Start Server
const PORT = process.env.PORT || 4848;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
