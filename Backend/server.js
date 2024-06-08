require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use('/api/dh-exchange', require('./routes/dhExchange'));

app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true,
  }
));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/books', require('./routes/book'));
app.use('/api/dh-exchange', require('./routes/dhExchange'));
app.use('/api/downloaded-books', require('./routes/downloadedBook'));

// console.log('MONGO_URI:', process.env.MONGO_URI);
// console.log('JWT_SECRET:', process.env.JWT_SECRET);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully.');
    app.listen(5000, () => console.log('Server running on port 5000'));
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};

startServer();
