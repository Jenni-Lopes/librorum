import { Router } from "express";
import {
  minhaBiblioteca,
  adicionarLivro,
  removerLivro,
  atualizarProgresso,
  atualizarStatus,
  buscarLivro
} from "../controllers/library.controller";

const router = Router();

router.get("/", minhaBiblioteca);

router.get("/:id", buscarLivro);

router.post("/", adicionarLivro);

router.put("/:id/progress", atualizarProgresso);

router.put("/:id/status", atualizarStatus);

router.delete("/:id", removerLivro);

export default router;
