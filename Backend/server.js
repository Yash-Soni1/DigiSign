const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// CORS: Allow frontend origin only
app.use(cors({
  origin: "https://digisign-frontend.onrender.com", // ✅ Replace this with your actual frontend URL
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo Error:', err));

// Routes
const authRoutes = require('./Routes/AuthRoutes');
const uploadRoutes = require('./Routes/uploadRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes); // make endpoint clear

// Fallback route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
