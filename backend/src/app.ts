import express from "express";
import cors from "cors";

import bookRoutes from "./routes/book.route";
import libraryRoutes from "./routes/library.route";
import userRoutes from "./routes/user.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/books", bookRoutes);
app.use("/library", libraryRoutes);
app.use("/auth", userRoutes);

export default app;
