import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'SMS SaaS API is running!'
  });
});

// API routes
app.get('/api/v1', (req, res) => {
  res.json({
    version: '1.0.0',
    name: 'SMS SaaS API'
  });
});

app.post('/api/v1/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'User registered',
    token: 'jwt_token'
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login successful',
    token: 'jwt_token'
  });
});

app.post('/api/v1/sms/send', (req, res) => {
  res.json({
    success: true,
    message: 'SMS sent',
    messageId: 'msg_123'
  });
});

app.get('/api/v1/wallet', (req, res) => {
  res.json({
    success: true,
    wallet: { balance: 100, currency: 'USD' }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
