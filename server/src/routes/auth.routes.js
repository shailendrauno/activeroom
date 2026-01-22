import express from "express";
import { register, resendVerification, verifyEmail, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);
router.post("/resebd-verification", resendVerification);

export default router;
