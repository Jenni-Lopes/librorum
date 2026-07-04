import express from "express";
import cors from "cors";

import bookRoutes from "./routes/book.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/books", bookRoutes);

export default app;