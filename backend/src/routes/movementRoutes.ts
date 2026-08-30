import express from "express";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/authMiddleware";
import { deleteMovement, editMovement, generateMovement, getMovements } from "../controllers/movementController";

const router = express.Router();

router.post("/", authMiddleware, generateMovement);
router.get("/", optionalAuthMiddleware, getMovements);
router.delete("/:id", authMiddleware, deleteMovement);
router.post("/:id", authMiddleware, editMovement);

export default router;

