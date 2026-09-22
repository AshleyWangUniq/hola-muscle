import express from "express";
import { addRecord, getRecords, deleteRecord } from "../controllers/strengthRecordController";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/", authMiddleware, addRecord);
router.get("/", authMiddleware, getRecords);
router.delete("/:id", authMiddleware, deleteRecord);

export default router;