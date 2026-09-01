import express from "express";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/authMiddleware";
import {generation, deletion, getWorkouts} from "../controllers/workoutController";

const router = express.Router();

router.post("/", authMiddleware, generation);
router.delete("/:id", authMiddleware, deletion);
router.get("/", optionalAuthMiddleware, getWorkouts);

export default router;