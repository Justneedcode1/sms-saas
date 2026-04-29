import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory storage (replace with database later)
const users = {};

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'SMS SaaS API is running!'
  });
});

// API version
app.get('/api/v1', (req, res) => {
  res.json({
    version: '1.0.0',
    name: 'SMS SaaS API'
  });
});

// Register with Email
app.post('/api/v1/auth/register', (req, res) => {
  try {
    const { email, password, firstName, lastName, companyName } = req.body;

    console.log('Register request:', { email, firstName, lastName });

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user exists
    if (users[email]) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const userId = 'user_' + Date.now();
    users[email] = {
      id: userId,
      email,
      password,
      firstName,
      lastName,
      companyName: companyName || 'My Company',
      walletBalance: 100,
      createdAt: new Date()
    };

    const token = 'token_' + userId;

    console.log('User registered:', email);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        companyName: users[email].companyName
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration error: ' + error.message
    });
  }
});

// Login
app.post('/api/v1/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }

    const user = users[email];

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = 'token_' + user.id;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login error: ' + error.message
    });
  }
});

// Send SMS
app.post('/api/v1/sms/send', (req, res) => {
  const { to, message, senderId } = req.body;

  if (!to || !message) {
    return res.status(400).json({
      success: false,
      message: 'Phone and message required'
    });
  }

  res.json({
    success: true,
    message: 'SMS sent successfully',
    messageId: 'msg_' + Date.now(),
    status: 'queued',
    cost: 0.0075,
    remainingBalance: 99.9925
  });
});

// Get wallet
app.get('/api/v1/wallet', (req, res) => {
  res.json({
    success: true,
    wallet: {
      balance: 100.00,
      currency: 'USD',
      totalSpent: 0,
      totalRecharged: 0
    }
  });
});

// Get messages
app.get('/api/v1/sms/messages', (req, res) => {
  res.json({
    success: true,
    messages: []
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
