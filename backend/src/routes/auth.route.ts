import { Router } from "express";
import { login, register, getProfile, refreshToken, logout } from "../controller/auth.controller";
import { protectRoute } from "../middlewares/auth.middleware"

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/profile", protectRoute, getProfile);
router.post('/logout',protectRoute, logout);


export default router;
