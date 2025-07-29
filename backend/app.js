require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/users', require('./routes/userRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running!' });
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
app.use('/api/fasilitas', require('./routes/fasilitasRoutes'));
const manpowerRoutes = require('./routes/manpowerRoutes');
app.use('/api/manpower', manpowerRoutes);
// TODO: Tambahkan routes lain di sini
app.use('/api/action-plan', require('./routes/actionPlanRoute')); // Integrasi Action Plan
const sertifikatSioRoutes = require('./routes/sertifikatSioRoutes');
app.use('/api/sertifikat-sio', sertifikatSioRoutes);

app.listen(3001, () => console.log('Server running on port 3001'));
