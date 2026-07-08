import { Router } from "express";
import { buscarLivro, buscarLivroPorId } from "../controllers/book.controller";

const router = Router();

router.get("/", buscarLivro);
router.get("/:id", buscarLivroPorId);

export default router;
