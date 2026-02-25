import { createRoom, findRoomByCode, getRoomWithIdeas } from "../repositories/rooms.repository.js";
import { generateRoomCode } from "../utils/roomCode.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { signRoomToken } from "../utils/jwt.js";

function createHttpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export async function createRoomService({ name, password }) {
  const code = generateRoomCode();
  const passwordHash = await hashPassword(password?.trim());

  const room = await createRoom({
    code,
    name: name.trim(),
    passwordHash,
  });

  const token = signRoomToken({ roomId: room.id, code: room.code });
  return { room: { id: room.id, code: room.code, name: room.name }, token };
}

export async function joinRoomService({ code, password }) {
  const room = await findRoomByCode(code.trim().toUpperCase());
  if (!room) throw createHttpError(404, "Room not found");

  const ok = await verifyPassword(password?.trim(), room.passwordHash);
  if (!ok) throw createHttpError(401, "Invalid password");

  const token = signRoomToken({ roomId: room.id, code: room.code });
  return { room: { id: room.id, code: room.code, name: room.name }, token };
}

export async function getMyRoomService(roomId) {
  const room = await getRoomWithIdeas(roomId);
  if (!room) throw createHttpError(404, "Room not found");
  return room;
}