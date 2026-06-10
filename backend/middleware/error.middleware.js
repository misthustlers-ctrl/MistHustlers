export function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.id || ""} ${err.message}`);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: status < 500 ? err.message : "Internal server error",
  });
}
