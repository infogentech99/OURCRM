const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  console.log('Received Token:', token);  // Debugging log

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = verified;
    console.log('Token Verified:', verified);  // Debugging log
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);  // Log the error
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
