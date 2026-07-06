import { Router } from "express";
import { cadastro, login, sair } from "../controllers/user.controller";

const router = Router();

router.post("/cadastro", cadastro);
router.post("/login", login);
router.post("/sair", sair);

export default router;
