import { Router } from "express";
import { login, register, getProfile } from "../controller/auth.controller";
import { protectRoute } from "../middlewares/auth.middleware"

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protectRoute, getProfile);


export default router;
