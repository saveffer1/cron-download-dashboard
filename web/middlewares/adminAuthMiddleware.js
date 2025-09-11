exports.adminAuth = (req, res, next) => {
  if (!req.session.role || req.session.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};