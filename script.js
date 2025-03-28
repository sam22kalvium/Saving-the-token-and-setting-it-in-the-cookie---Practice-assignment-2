const jwt = require('jsonwebtoken');

// Function to create a JWT token
const encrypt = (payload, secret) => {
  // Sign the token with the payload and secret key
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });  // Token expires in 1 hour
  return token;
};

module.exports = encrypt;
