import { Request, Response } from "express";
import { AuthPayload } from "../tipos/auth-payload";
import {
    deletarReviewService,
    listarReviewsService,
    listarReviewsUsuarioService,
    salvarReviewService,
} from "../services/review.service";

function getUsuarioId(res: Response) {
    const usuario = res.locals.user as AuthPayload | undefined;
    return usuario?.id;
}

function isRatingValido(rating: unknown): rating is number {
    return typeof rating === "number" && Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

export async function listarReviews(req: Request, res: Response) {
    try {
        const { googleBookId } = req.params;

        if (!googleBookId || typeof googleBookId !== "string") {
            return res.status(400).json({
                erro: "Google Book ID e obrigatorio.",
            });
        }

        const reviews = await listarReviewsService(googleBookId);

        return res.status(200).json(reviews);
    } catch {
        return res.status(500).json({
            erro: "Erro ao buscar avaliacoes.",
        });
    }
}

export async function listarMinhasReviews(_req: Request, res: Response) {
    try {
        const userId = getUsuarioId(res);

        if (!userId) {
            return res.status(401).json({
                erro: "Usuario nao autenticado.",
            });
        }

        const reviews = await listarReviewsUsuarioService(userId);

        return res.status(200).json(reviews);
    } catch {
        return res.status(500).json({
            erro: "Erro ao buscar suas avaliacoes.",
        });
    }
}

export async function salvarReview(req: Request, res: Response) {
    try {
        const userId = getUsuarioId(res);
        const { googleBookId, rating, text } = req.body;

        if (!userId) {
            return res.status(401).json({
                erro: "Usuario nao autenticado.",
            });
        }

        if (!googleBookId) {
            return res.status(400).json({
                erro: "Google Book ID e obrigatorio.",
            });
        }

        if (!isRatingValido(rating)) {
            return res.status(400).json({
                erro: "Nota invalida.",
            });
        }

        if (typeof text !== "string" || !text.trim()) {
            return res.status(400).json({
                erro: "Texto da avaliacao e obrigatorio.",
            });
        }

        const review = await salvarReviewService(googleBookId, userId, rating, text.trim());

        return res.status(201).json(review);
    } catch {
        return res.status(500).json({
            erro: "Erro ao salvar avaliacao.",
        });
    }
}

export async function deletarReview(req: Request, res: Response) {
    try {
        const userId = getUsuarioId(res);
        const id = Number(req.params.id);

        if (!userId) {
            return res.status(401).json({
                erro: "Usuario nao autenticado.",
            });
        }

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                erro: "ID da avaliacao invalido.",
            });
        }

        await deletarReviewService(id, userId);

        return res.status(200).json({
            mensagem: "Avaliacao removida com sucesso.",
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(404).json({
                erro: error.message,
            });
        }

        return res.status(500).json({
            erro: "Erro ao remover avaliacao.",
        });
    }
}
