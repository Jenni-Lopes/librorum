import { Router } from "express";
import {
  minhaBiblioteca,
  adicionarLivro,
  removerLivro,
  atualizarStatus,
  buscarLivro
} from "../controllers/library.controller";

const router = Router();

router.get("/", minhaBiblioteca);

router.get("/:id", buscarLivro);

router.post("/", adicionarLivro);

router.put("/:id/status", atualizarStatus);

router.delete("/:id", removerLivro);

export default router;
