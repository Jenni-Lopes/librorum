import { Request, Response } from "express";
import { ReadingStatus } from "@prisma/client";
import {
    adicionarLivroService,
    listarBibliotecaService,
    buscarLivroService,
    atualizarProgressoService,
    atualizarStatusService,
    removerLivroService,
} from "../services/library.service";
import { AuthPayload } from "../tipos/auth-payload";

const STATUS_VALIDOS = Object.values(ReadingStatus);

function getUsuarioId(res: Response) {
    const usuario = res.locals.user as AuthPayload | undefined;
    return usuario?.id;
}

function isStatusValido(status: unknown): status is ReadingStatus {
    return typeof status === "string" && STATUS_VALIDOS.includes(status as ReadingStatus);
}

function isNotaValida(nota: unknown): nota is number {
    return typeof nota === "number" && nota >= 1 && nota <= 5;
}

export async function minhaBiblioteca(_req: Request, res: Response) {
    try {
        const userId = getUsuarioId(res);

        if (!userId) {
            return res.status(401).json({
                erro: "Usuario nao autenticado.",
            });
        }

        const livros = await listarBibliotecaService(userId);

        return res.status(200).json(livros);
    } catch {
        return res.status(500).json({
            erro: "Erro ao buscar biblioteca.",
        });
    }
}

export async function buscarLivro(req: Request, res: Response) {
    try {
        const userId = getUsuarioId(res);
        const id = Number(req.params.id);

        if (!userId) {
            return res.status(401).json({
                erro: "Usuario nao autenticado.",
            });
        }

        const livro = await buscarLivroService(id, userId);

        if (!livro) {
            return res.status(404).json({
                erro: "Livro nao encontrado.",
            });
        }

        return res.status(200).json(livro);
    } catch {
        return res.status(500).json({
            erro: "Erro ao buscar livro.",
        });
    }
}

export async function adicionarLivro(req: Request, res: Response) {
    try {
        const userId = getUsuarioId(res);
        const { googleBookId, status, nota } = req.body;

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

        if (status && !isStatusValido(status)) {
            return res.status(400).json({
                erro: "Status de leitura invalido.",
            });
        }

        if (nota !== undefined && !isNotaValida(nota)) {
            return res.status(400).json({
                erro: "Nota invalida.",
            });
        }

        const livro = await adicionarLivroService(
            googleBookId,
            userId,
            status ?? ReadingStatus.WANT_TO_READ,
            nota
        );

        return res.status(201).json(livro);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                erro: error.message,
            });
        }

        return res.status(500).json({
            erro: "Erro ao adicionar livro.",
        });
    }
}

export async function atualizarProgresso(_req: Request, res: Response) {
    await atualizarProgressoService();

    return res.status(501).json({
        mensagem: "Funcao ainda nao implementada.",
    });
}

export async function atualizarStatus(req: Request, res: Response) {
    try {
        const userId = getUsuarioId(res);
        const id = Number(req.params.id);
        const { status } = req.body;

        if (!userId) {
            return res.status(401).json({
                erro: "Usuario nao autenticado.",
            });
        }

        if (!isStatusValido(status)) {
            return res.status(400).json({
                erro: "Status de leitura invalido.",
            });
        }

        const livro = await atualizarStatusService(id, userId, status);

        return res.status(200).json(livro);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(404).json({
                erro: error.message,
            });
        }

        return res.status(500).json({
            erro: "Erro ao atualizar status.",
        });
    }
}

export async function removerLivro(req: Request, res: Response) {
    try {
        const userId = getUsuarioId(res);
        const id = Number(req.params.id);

        if (!userId) {
            return res.status(401).json({
                erro: "Usuario nao autenticado.",
            });
        }

        await removerLivroService(id, userId);

        return res.status(200).json({
            mensagem: "Livro removido com sucesso.",
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(404).json({
                erro: error.message,
            });
        }

        return res.status(500).json({
            erro: "Erro ao remover livro.",
        });
    }
}
