const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const uploadRoutes = require('./Routes/uploadRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo Error:', err));

// Routes
const authRoutes = require('./Routes/AuthRoutes');
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api', uploadRoutes);
