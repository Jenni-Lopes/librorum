import { Request, Response } from "express";
import {
    adicionarLivroService,
    listarBibliotecaService,
    buscarLivroService,
    atualizarProgressoService,
    atualizarStatusService,
    removerLivroService
} from "../services/library.service";

/* -- GET /library -- */

export async function minhaBiblioteca(req: Request, res: Response) {
    try {

        const userId = Number(req.query.userId);

        const livros = await listarBibliotecaService(userId);

        return res.status(200).json(livros);

    } catch (error) {

        return res.status(500).json({
            erro: "Erro ao buscar biblioteca."
        });

    }
}

/* -- GET /library/:id -- */

export async function buscarLivro(req: Request, res: Response) {
    try {

        const id = Number(req.params.id);

        const livro = await buscarLivroService(id);

        if (!livro) {
            return res.status(404).json({
                erro: "Livro não encontrado."
            });
        }

        return res.status(200).json(livro);

    } catch (error) {

        return res.status(500).json({
            erro: "Erro ao buscar livro."
        });

    }
}

/* -- POST /library -- */

export async function adicionarLivro(req: Request, res: Response) {
    try {

        const { googleBookId, userId } = req.body;

        if (!googleBookId || !userId) {
            return res.status(400).json({
                erro: "googleBookId e userId são obrigatórios."
            });
        }

        const livro = await adicionarLivroService(
            googleBookId,
            Number(userId)
        );

        return res.status(201).json(livro);

    } catch (error) {

        if (error instanceof Error) {
            return res.status(400).json({
                erro: error.message
            });
        }

        return res.status(500).json({
            erro: "Erro ao adicionar livro."
        });

    }
}

/* -- PUT /library/:id/progress -- */

export async function atualizarProgresso(req: Request, res: Response) {
    return res.status(501).json({
        mensagem: "Função ainda não implementada."
    });
}

/* -- PUT /library/:id/status -- */

export async function atualizarStatus(req: Request, res: Response) {
    return res.status(501).json({
        mensagem: "Função ainda não implementada."
    });
}

/* -- DELETE /library/:id -- */

export async function removerLivro(req: Request, res: Response) {
    try {

        const id = Number(req.params.id);

        await removerLivroService(id);

        return res.status(200).json({
            mensagem: "Livro removido com sucesso."
        });

    } catch (error) {

        return res.status(500).json({
            erro: "Erro ao remover livro."
        });

    }
}