import express  from "express";
import { logIn, createUser, profile, resetPasswords, updateInfo } from "../controllers/userController";
import { deletion } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/", createUser);
router.post("/login", logIn);
router.get("/", profile);
router.delete("/", authMiddleware, deletion);
router.post("/resetPassword", authMiddleware, resetPasswords);
router.post("/updateInfo", authMiddleware, updateInfo);


export default router;