require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const yogaFilesRoute = require('./routes/yoga_files');
const yogaAuthRoute = require('./routes/auth');
const yogaActivityRoute = require('./routes/activity');



connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/yoga', yogaFilesRoute);
app.use('/api/yoga', yogaAuthRoute);
app.use('/api/yoga', yogaActivityRoute);



const PORT = process.env.PORT || 5000;



app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});

