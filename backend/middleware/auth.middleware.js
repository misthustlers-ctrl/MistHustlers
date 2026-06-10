export function authenticateApiKey(req, res, next) {
  const key = req.headers["x-api-key"];
  const expected = process.env.API_KEY;

  if (!expected) {
    return res.status(500).json({
      success: false,
      message: "Server misconfiguration: API_KEY not set",
    });
  }

  if (!key || key !== expected) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: invalid or missing API key",
    });
  }

  next();
}
