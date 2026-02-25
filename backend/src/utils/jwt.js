import jwt from "jsonwebtoken";

export function signRoomToken({ roomId, code }) {
  return jwt.sign({ roomId, code }, process.env.JWT_SECRET, { expiresIn: "7d" });
}