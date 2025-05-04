// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = "your_jwt_secret"; // Must match the secret in auth.js

module.exports = function(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};