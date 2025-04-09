

const isAdmin = (req, res, next) => {
  // Assuming you store user info in req.user after authentication
  if (req.user && req.user.isAdmin) {
    return next(); // User is admin, proceed to next middleware
  }
  return res.status(403).json({ message: "Access denied. Not an admin." });
};

module.exports = { isAdmin };
