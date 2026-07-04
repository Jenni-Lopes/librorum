import { Router } from "express";
import { buscarLivro } from "../controllers/book.controller";

const router = Router();

router.get("/", buscarLivro);

export default router;