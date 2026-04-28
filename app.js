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
  const { email, password, firstName, lastName, companyName } = req.body;

  // Validate input
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
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
    password, // In production, hash this!
    firstName,
    lastName,
    companyName: companyName || 'My Company',
    walletBalance: 100, // Free $100 on signup
    createdAt: new Date()
  };

  const token = 'token_' + userId;

  res.json({
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
});

// Login
app.post('/api/v1/auth/login', (req, res) => {
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

  res.json({
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
});

// Google OAuth Login
app.post('/api/v1/auth/google', (req, res) => {
  const { idToken, email, firstName, lastName, picture } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Google login failed'
    });
  }

  // Check if user exists
  if (!users[email]) {
    // Create new user from Google
    const userId = 'user_' + Date.now();
    users[email] = {
      id: userId,
      email,
      firstName: firstName || 'User',
      lastName: lastName || '',
      companyName: 'My Company',
      picture,
      googleId: idToken,
      walletBalance: 100, // Free $100 on signup
      signupMethod: 'google',
      createdAt: new Date()
    };
  }

  const user = users[email];
  const token = 'token_' + user.id;

  res.json({
    success: true,
    message: 'Google login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      picture: user.picture
    }
  });
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
  res.json({app.post('/api/v1/auth/login', (req, res) => {
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
