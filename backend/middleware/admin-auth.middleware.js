export function adminAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  try {
    const base64 = auth.split(" ")[1];
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    const [username, password] = decoded.split(":");

    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;

    if (!expectedUser || !expectedPass) {
      return res.status(500).json({ success: false, message: "Admin credentials not configured" });
    }

    if (username !== expectedUser || password !== expectedPass) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    next();
  } catch {
    res.status(400).json({ success: false, message: "Invalid authorization header" });
  }
}
