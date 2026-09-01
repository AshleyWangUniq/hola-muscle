import express  from "express";
import { logIn, createUser, profile } from "../controllers/userController";
import { deletion } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/", createUser);
router.post("/login", logIn);
router.get("/", profile);
router.delete("/", authMiddleware, deletion);


export default router;