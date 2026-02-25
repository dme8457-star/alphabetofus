import { prisma } from "../db/prisma.js";

export function createIdea({ roomId, letter, description }) {
  return prisma.idea.create({
    data: {
      roomId,
      letter: letter.toUpperCase(),
      description,
    },
  });
}

export function listIdeas(roomId) {
  return prisma.idea.findMany({
    where: { roomId },
    orderBy: [{ createdAt: "desc" }],
  });
}

export function listAvailableIdeas(roomId, letter) {
  return prisma.idea.findMany({
    where: {
      roomId,
      used: false,
      ...(letter ? { letter: letter.toUpperCase() } : {}),
    },
  });
}

export function markIdeaUsed(ideaId) {
  return prisma.idea.update({
    where: { id: ideaId },
    data: { used: true },
  });
}

export function resetIdeas(roomId) {
  return prisma.idea.updateMany({
    where: { roomId },
    data: { used: false },
  });
}
