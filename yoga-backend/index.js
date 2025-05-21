require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');



const connectDB = require('./config/db');
const yogaRoutes = require('./routes/routes');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/yoga', yogaRoutes);

const PORT = process.env.PORT || 5000;



app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});

