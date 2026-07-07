import { Router } from "express";
import { buscarMetaAtual, salvarMetaAtual } from "../controllers/goal.controller";

const router = Router();

router.get("/current", buscarMetaAtual);
router.put("/current", salvarMetaAtual);

export default router;
