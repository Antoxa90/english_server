module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    console.log('Unauthorized');
    res.status(401).json({ message: 'Authorization Required', status: 401 });
  }
}