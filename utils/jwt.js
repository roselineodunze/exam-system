import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function signJWTtoken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
export function verifyJWTToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
