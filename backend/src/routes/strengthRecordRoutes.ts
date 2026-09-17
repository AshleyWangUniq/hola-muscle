import express from "express";
import { addRecord, getRecords } from "../controllers/strengthRecordController";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/", authMiddleware, addRecord);
router.get("/", authMiddleware, getRecords);

export default router;