const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const shopRoutes = require('./routes/shopRoutes');
const itemRoutes = require('./routes/itemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');


// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app FIRST
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api', itemRoutes);
app.use('/api', orderRoutes);


// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Grocery Backend is running 🚀',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});


