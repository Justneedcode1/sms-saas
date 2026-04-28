import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [wallet, setWallet] = useState(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerFirstName, setRegisterFirstName] = useState('')
  const [registerLastName, setRegisterLastName] = useState('')
  const [smsTo, setSmsTo] = useState('')
  const [smsMessage, setSmsMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_URL = 'https://sms-saas-production.up.railway.app/api/v1'

  // Load wallet on mount
  useEffect(() => {
    if (user) {
      loadWallet()
      loadMessages()
    }
  }, [user])

  const loadWallet = async () => {
    try {
      const response = await axios.get(`${API_URL}/wallet`, {
        headers: { Authorization: `Bearer ${user}` }
      })
      setWallet(response.data.wallet)
    } catch (err) {
      console.error('Error loading wallet:', err)
    }
  }

  const loadMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/sms/messages`, {
        headers: { Authorization: `Bearer ${user}` }
      })
      setMessages(response.data.messages || [])
    } catch (err) {
      console.error('Error loading messages:', err)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email: registerEmail,
        password: registerPassword,
        firstName: registerFirstName,
        lastName: registerLastName,
        companyName: 'My Company'
      })
      setUser(response.data.token)
      setSuccess('Registration successful!')
      setCurrentPage('dashboard')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: loginEmail,
        password: loginPassword
      })
      setUser(response.data.token)
      setSuccess('Login successful!')
      setCurrentPage('dashboard')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  const handleSendSMS = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await axios.post(`${API_URL}/sms/send`, {
        to: smsTo,
        message: smsMessage,
        senderId: 'SMSSaaS'
      }, {
        headers: { Authorization: `Bearer ${user}` }
      })
      setSuccess('SMS sent successfully!')
      setSmsTo('')
      setSmsMessage('')
      loadWallet()
      loadMessages()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send SMS')
    }
  }

  const handleLogout = () => {
    setUser(null)
    setWallet(null)
    setMessages([])
    setCurrentPage('login')
  }

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1>SMS SaaS Platform</h1>
          
          {currentPage === 'login' ? (
            <form onSubmit={handleLogin}>
              <h2>Login</h2>
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
              <p>
                Don't have an account?{' '}
                <a href="#" onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage('register')
                  setError('')
                  setSuccess('')
                }}>
                  Register
                </a>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <h2>Create Account</h2>
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}
              <input
                type="text"
                placeholder="First Name"
                value={registerFirstName}
                onChange={(e) => setRegisterFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={registerLastName}
                onChange={(e) => setRegisterLastName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password (min 8 chars)"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                minLength="8"
              />
              <button type="submit">Create Account</button>
              <p>
                Already have an account?{' '}
                <a href="#" onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage('login')
                  setError('')
                  setSuccess('')
                }}>
                  Login
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>SMS SaaS Platform</h1>
          <div className="nav-buttons">
            <button
              className={currentPage === 'dashboard' ? 'active' : ''}
              onClick={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={currentPage === 'send-sms' ? 'active' : ''}
              onClick={() => setCurrentPage('send-sms')}
            >
              Send SMS
            </button>
            <button
              className={currentPage === 'wallet' ? 'active' : ''}
              onClick={() => setCurrentPage('wallet')}
            >
              Wallet
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        {currentPage === 'dashboard' && (
          <div className="page">
            <h2>Dashboard</h2>
            <div className="cards-grid">
              <div className="card">
                <h3>Wallet Balance</h3>
                <p className="big-number">
                  ${wallet?.balance?.toFixed(2) || '0.00'}
                </p>
                <p className="currency">{wallet?.currency || 'USD'}</p>
              </div>
              <div className="card">
                <h3>Total SMS Sent</h3>
                <p className="big-number">{messages.length}</p>
                <p className="subtitle">Messages</p>
              </div>
              <div className="card">
                <h3>Account Status</h3>
                <p className="big-number">✅</p>
                <p className="subtitle">Active</p>
              </div>
            </div>

            <h3 style={{ marginTop: '40px' }}>Recent Messages</h3>
            <div className="messages-table">
              {messages.length === 0 ? (
                <p>No messages sent yet</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>To</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.slice(0, 10).map((msg, idx) => (
                      <tr key={idx}>
                        <td>{msg.recipientPhone}</td>
                        <td>{msg.messageText?.substring(0, 50)}...</td>
                        <td>
                          <span className={`status ${msg.status}`}>
                            {msg.status}
                          </span>
                        </td>
                        <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {currentPage === 'send-sms' && (
          <div className="page">
            <h2>Send SMS</h2>
            <form onSubmit={handleSendSMS} className="form-box">
              <div className="form-group">
                <label>Recipient Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1234567890"
                  value={smsTo}
                  onChange={(e) => setSmsTo(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  placeholder="Type your message here..."
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  required
                  rows="5"
                />
                <small>
                  {smsMessage.length} characters (1 SMS = 160 chars)
                </small>
              </div>
              <div className="form-group">
                <label>Estimated Cost</label>
                <input
                  type="text"
                  value={`$${(0.0075).toFixed(4)}`}
                  disabled
                />
              </div>
              <button type="submit" className="primary-btn">
                Send SMS
              </button>
            </form>
          </div>
        )}

        {currentPage === 'wallet' && (
          <div className="page">
            <h2>Wallet</h2>
            <div className="cards-grid">
              <div className="card large">
                <h3>Current Balance</h3>
                <p className="big-number">
                  ${wallet?.balance?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>

            <div className="wallet-stats">
              <div className="stat-item">
                <h4>Total Spent</h4>
                <p>${wallet?.totalSpent?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="stat-item">
                <h4>Total Recharged</h4>
                <p>${wallet?.totalRecharged?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="stat-item">
                <h4>Low Balance Alert</h4>
                <p>${wallet?.lowBalanceThreshold || '10.00'}</p>
              </div>
            </div>

            <div className="topup-section">
              <h3>Top-up Wallet</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Add credit to your wallet using Stripe or Cryptocurrency
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="secondary-btn" disabled>
                  💳 Top-up with Stripe (Coming Soon)
                </button>
                <button className="secondary-btn" disabled>
                  ₿ Top-up with Crypto (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
