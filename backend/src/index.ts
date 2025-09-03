import express from 'express';
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();


const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});