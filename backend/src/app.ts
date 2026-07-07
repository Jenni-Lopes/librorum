import express from "express";
import cors from "cors";

import bookRoutes from "./routes/book.route";
import libraryRoutes from "./routes/library.route";
import userRoutes from "./routes/user.route";
import { authMiddleware } from "./middlewares/auth.middleware";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials:true
}));



app.use(cookieParser())
app.use("/auth", userRoutes);
app.use("/books", authMiddleware, bookRoutes);
app.use("/library", authMiddleware, libraryRoutes);

export default app;
