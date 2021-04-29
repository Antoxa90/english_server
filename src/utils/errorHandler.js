const errorHandler = (message, log) => {
  if (log) {
    console.log(log);
  }
  return res.status(500).json({ message, status: 500 });
}

module.exports = errorHandler;