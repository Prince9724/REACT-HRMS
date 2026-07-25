export const isAdmin = (req, res, next) => {
  if (req.admin) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
};