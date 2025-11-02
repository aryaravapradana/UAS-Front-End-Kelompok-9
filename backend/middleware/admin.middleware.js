const admin = (req, res, next) => {
  if (req.member && req.member.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

module.exports = admin;
