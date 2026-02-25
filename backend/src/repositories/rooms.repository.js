import { prisma } from "../db/prisma.js";

export function createRoom({ code, name, passwordHash }) {
  return prisma.room.create({
    data: { code, name, passwordHash },
  });
}

export function findRoomByCode(code) {
  return prisma.room.findUnique({ where: { code } });
}

export function findRoomById(roomId) {
  return prisma.room.findUnique({ where: { id: roomId } });
}

export function getRoomWithIdeas(roomId) {
  return prisma.room.findUnique({
    where: { id: roomId },
    include: {
      ideas: { orderBy: [{ createdAt: "desc" }] },
    },
  });
}