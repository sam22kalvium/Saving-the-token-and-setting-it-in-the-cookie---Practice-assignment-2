const express = require('express');
const cookieParser = require('cookie-parser');
const encrypt = require('./script');  // Import the encrypt function
const jwt = require('jsonwebtoken');
const app = express();
const secretKey = 'your-secret-key';  // Replace with a secure key, ideally from environment variables

app.use(express.json());  // For parsing application/json
app.use(cookieParser());  // For parsing cookies

// Login route to generate JWT
app.post('/login', (req, res) => {
  const { userId } = req.body;  // Assuming userId is passed in the request body

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Encrypt (sign) the token with userId as the payload
  const token = encrypt({ userId }, secretKey);

  // Send token as a cookie
  res.cookie('authToken', token, { httpOnly: true, secure: false, maxAge: 3600000 }); // Token expires in 1 hour
  res.status(200).json({ message: 'Login successful', token });
});

// Protected route that requires a valid JWT
app.get('/protected', (req, res) => {
  const token = req.cookies.authToken;  // Get the token from cookies

  if (!token) {
    return res.status(403).json({ message: 'No token provided, access denied.' });
  }

  // Verify the token and decode the payload
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // If token is valid, allow access to protected resource
    res.status(200).json({ message: 'Welcome to your protected resource', user: decoded });
  });
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
