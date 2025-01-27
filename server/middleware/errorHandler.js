const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const errorResponse = {
    message: err.message || "Internal Server Error",
    status: err.status || 500,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  res.status(errorResponse.status).json(errorResponse);
};

module.exports = errorHandler;
