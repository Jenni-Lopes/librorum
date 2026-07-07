import { Router } from "express";
import {
  minhaBiblioteca,
  adicionarLivro,
  removerLivro,
  atualizarProgresso,
  atualizarStatus,
  buscarLivro
} from "../controllers/library.controller";

import {
    autenticarToken
} from "../middlewares/auth.middleware";

const router = Router();

router.get(
    "/",
    autenticarToken,
    minhaBiblioteca
);

router.get("/:id", buscarLivro);

router.post(
    "/",
    autenticarToken,
    adicionarLivro
);

router.put("/:id/progress", atualizarProgresso);

router.put("/:id/status", atualizarStatus);

router.delete("/:id", removerLivro);

export default router;