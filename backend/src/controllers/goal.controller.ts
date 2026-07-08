import { Request, Response } from "express";
import { AuthPayload } from "../tipos/auth-payload";
import { buscarMetaAtualService, salvarMetaAtualService } from "../services/goal.service";

function getUsuarioId(res: Response) {
    const usuario = res.locals.user as AuthPayload | undefined;
    return usuario?.id;
}

function getAnoAtual() {
    return new Date().getFullYear();
}

export async function buscarMetaAtual(_req: Request, res: Response) {
    try {
        const userId = getUsuarioId(res);

        if (!userId) {
            return res.status(401).json({
                erro: "Usuario nao autenticado.",
            });
        }

        const year = getAnoAtual();
        const meta = await buscarMetaAtualService(userId, year);

        return res.status(200).json({
            year,
            target: meta?.target ?? null,
        });
    } catch {
        return res.status(500).json({
            erro: "Erro ao buscar meta.",
        });
    }
}

export async function salvarMetaAtual(req: Request, res: Response) {
    try {
        const userId = getUsuarioId(res);
        const { target } = req.body;

        if (!userId) {
            return res.status(401).json({
                erro: "Usuario nao autenticado.",
            });
        }

        if (!Number.isInteger(target) || target < 1 || target > 999) {
            return res.status(400).json({
                erro: "Meta invalida.",
            });
        }

        const meta = await salvarMetaAtualService(userId, getAnoAtual(), target);

        return res.status(200).json(meta);
    } catch {
        return res.status(500).json({
            erro: "Erro ao salvar meta.",
        });
    }
}
