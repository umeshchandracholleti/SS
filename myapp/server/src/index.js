require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const catalogRoutes = require('./routes/catalog');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const rfqRoutes = require('./routes/rfq');
const creditRoutes = require('./routes/credit');
const reviewRoutes = require('./routes/reviews');
const supportRoutes = require('./routes/support');
const grievanceRoutes = require('./routes/grievances');
const adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', catalogRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api', rfqRoutes);
app.use('/api', creditRoutes);
app.use('/api', reviewRoutes);
app.use('/api', supportRoutes);
app.use('/api', grievanceRoutes);
app.use('/api', adminRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Server error'
  });
});

app.listen(port, () => {
  console.log(`API listening on ${port}`);
});
