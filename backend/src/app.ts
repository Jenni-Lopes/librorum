import express from "express";
import cors from "cors";

import bookRoutes from "./routes/book.route";
import libraryRoutes from "./routes/library.route";
import userRoutes from "./routes/user.route";
import { autenticarToken } from "./middlewares/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/books", autenticarToken, bookRoutes);
app.use("/library", autenticarToken, libraryRoutes);

export default app;
