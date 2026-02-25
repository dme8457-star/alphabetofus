import jwt from "jsonwebtoken";

export function requireRoomAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.roomAuth = payload; // { roomId, code }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}