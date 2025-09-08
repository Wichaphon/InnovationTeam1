import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as path from "path";


import authRoutes from "./routes/auth.route";

if (!process.env.PORT) {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}

const app = express();

app.use(express.json());
app.use(cookieParser());

const originEnv = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";
const allowedOrigins = originEnv.split(",").map(s => s.trim()).filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.set("trust proxy", 1);


//---- routes ----
app.use("/api/auth", authRoutes);

//---- start server ----
const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
