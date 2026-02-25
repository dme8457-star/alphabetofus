import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin 0/O/1/I para evitar confusión
const nanoid = customAlphabet(alphabet, Number(process.env.ROOM_CODE_LENGTH || 8));

export function generateRoomCode() {
  return nanoid();
}