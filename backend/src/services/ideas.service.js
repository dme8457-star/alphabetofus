import {
  createIdea,
  listAvailableIdeas,
  markIdeaUsed,
  resetIdeas,
} from "../repositories/ideas.repository.js";

function createHttpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export async function addIdeaService({ roomId, letter, description }) {
  const normalizedLetter = String(letter || "").trim().toUpperCase();
  const normalizedDesc = String(description || "").trim();

  if (!/^[A-Z]$/.test(normalizedLetter)) {
    throw createHttpError(400, "Letter must be A-Z");
  }
  if (!normalizedDesc) {
    throw createHttpError(400, "Description is required");
  }

  return createIdea({
    roomId,
    letter: normalizedLetter,
    description: normalizedDesc,
  });
}

export async function spinService(roomId, letter) {
  const normalizedLetter = String(letter || "").trim().toUpperCase();
  if (!/^[A-Z]$/.test(normalizedLetter)) {
    throw createHttpError(400, "Letter must be A-Z");
  }

  const available = await listAvailableIdeas(roomId, normalizedLetter);
  if (!available.length) return null;
  if (available.length < 2) {
    throw createHttpError(400, "Need at least 2 available ideas for this letter");
  }

  const idx = Math.floor(Math.random() * available.length);
  const chosen = available[idx];

  await markIdeaUsed(chosen.id);
  return chosen;
}

export async function resetIdeasService(roomId) {
  await resetIdeas(roomId);
  return { ok: true };
}
