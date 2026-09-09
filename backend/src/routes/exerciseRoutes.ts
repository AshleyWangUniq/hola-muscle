import express from "express";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/authMiddleware";
import { deleteExercise, editExercise, generateExercise, getExercise } from "../controllers/exerciseController";

const router = express.Router();

router.post("/", authMiddleware, generateExercise);
router.get("/", optionalAuthMiddleware, getExercise);
router.delete("/:id", authMiddleware, deleteExercise);
router.post("/:id", authMiddleware, editExercise);

export default router;

