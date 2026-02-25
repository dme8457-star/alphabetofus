import { Router } from "express";
import * as roomsController from "../controllers/rooms.controller.js";
import { requireRoomAuth } from "../middleware/auth.js";

const router = Router();

// public
router.post("/", roomsController.createRoom);
router.post("/join", roomsController.joinRoom);

// private (needs token)
router.get("/me", requireRoomAuth, roomsController.getRoomMe);
router.post("/ideas", requireRoomAuth, roomsController.addIdea);
router.post("/spin", requireRoomAuth, roomsController.spin);
router.post("/reset", requireRoomAuth, roomsController.resetIdeas);

export default router;
