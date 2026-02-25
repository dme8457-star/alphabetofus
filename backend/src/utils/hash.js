import bcrypt from "bcrypt";

export async function hashPassword(password) {
  if (!password) return null;
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  if (!hash) return true;       // sala sin password
  if (!password) return false;
  return bcrypt.compare(password, hash);
}