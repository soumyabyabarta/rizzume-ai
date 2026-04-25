require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analyze', require('./routes/analyze'));
app.use('/api/ai', require('./routes/ai'));

// Basic health check route
app.get('/', (req, res) => {
    res.send('Rizzume API is running smoothly 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});