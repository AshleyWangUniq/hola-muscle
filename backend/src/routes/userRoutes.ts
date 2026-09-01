import express  from "express";
import { logIn, createUser, profile } from "../controllers/userController";
const router = express.Router();

router.post("/", createUser);
router.post("/login", logIn);
router.get("/", profile);

export default router;