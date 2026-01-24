const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('AUTH HEADER:', req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ TOKEN NOT RECEIVED');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('TOKEN RECEIVED:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('TOKEN DECODED:', decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ TOKEN INVALID', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};
