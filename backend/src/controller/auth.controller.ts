import type { Request, Response } from "express";
import { RegisterBody } from "../interfaces/auth.interface";
import { findUserByEmail, registerUser, loginUser, getUserProfile } from "../services/auth.service";
import { setRefreshCookie } from "../lib/jwt";

export const register = async (req: Request<{}, any, RegisterBody>, res: Response) => {
  try {
    const { email, username, password } = req.body;
    
    if (!email || !username || !password) {
      return res.status(400).json({ message: "email, username, password are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    const user = await registerUser({
      email,
      username,
      passwordHash: password,
    });

    return res.status(201).json({ user });

  } catch (err: any) {
    if (err.message === "Missing 'user' role") {
      return res.status(500).json({ message: "Missing required role 'user' in the database" });
    }
    
    console.error(err);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { accessToken, refreshToken } = await loginUser(email, password);

    setRefreshCookie(res, refreshToken);

    return res.status(200).json({ accessToken });
  } 
  
  catch (err: any) {
    if (err.message === "Invalid credentials") {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.error(err);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.userId as string; 
    const user = await getUserProfile(Number(userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};


