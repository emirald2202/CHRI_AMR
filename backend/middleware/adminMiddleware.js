module.exports = (req, res, next) => {
  // Assuming authMiddleware has already run and populated req.user
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin resources restricted.' });
  }
};
