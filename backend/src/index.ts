import express from 'express';
import router from './route/router.ts';
import { initialRoles } from './controller/authcontroller.ts';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());
initialRoles()


app.get('/', async (req: any, res: any) => {
    res.send("Welcome Backend");
});

app.use("/auth", router);

// app.get('/check', async (req: any, res: any) => {
//     try {
//         await prisma.$connect();
//         res.send("Connect to PostgreSQL with Prisma")
//         console.log("API called /test");
//     } catch (error) {
//         console.error("Database connection error:", error);
//         res.status(500).send("Failed to connect DB");
//     }
// });


const PORT = process.env.BACKEND_PORT;

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`)
});

