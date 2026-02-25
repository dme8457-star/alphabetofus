import { createRoomService, joinRoomService, getMyRoomService } from "../services/rooms.service.js";
import { addIdeaService, spinService, resetIdeasService } from "../services/ideas.service.js";

export async function createRoom(req, res, next) {
  try {
    const { name, password } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ message: "name is required" });

    const result = await createRoomService({ name, password });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function joinRoom(req, res, next) {
  try {
    const { code, password } = req.body || {};
    if (!code?.trim()) return res.status(400).json({ message: "code is required" });

    const result = await joinRoomService({ code, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getRoomMe(req, res, next) {
  try {
    const roomId = req.roomAuth.roomId;
    const room = await getMyRoomService(roomId);
    res.json(room);
  } catch (err) {
    next(err);
  }
}

export async function addIdea(req, res, next) {
  try {
    const roomId = req.roomAuth.roomId;
    const { letter, description } = req.body || {};

    const idea = await addIdeaService({ roomId, letter, description });
    res.status(201).json(idea);
  } catch (err) {
    next(err);
  }
}

export async function spin(req, res, next) {
  try {
    const roomId = req.roomAuth.roomId;
    const { letter } = req.body || {};
    const chosen = await spinService(roomId, letter);

    if (!chosen) return res.json({ message: "No ideas available" });
    res.json(chosen);
  } catch (err) {
    next(err);
  }
}

export async function resetIdeas(req, res, next) {
  try {
    const roomId = req.roomAuth.roomId;
    const result = await resetIdeasService(roomId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
