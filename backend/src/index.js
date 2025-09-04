require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const pingRoutes = require('./routes/ping.routes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

// Middlewares base
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', pingRoutes);

// Health root
app.get('/', (req, res) => {
  res.json({ name: 'TechStore API', status: 'running' });
});

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ API listening on http://localhost:${PORT}`);
});
