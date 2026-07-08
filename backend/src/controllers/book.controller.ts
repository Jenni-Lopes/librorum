import { Request, Response } from "express";
import { searchBookById, searchBooks } from "../services/book.service";

export async function buscarLivro(req: Request, res: Response) {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                erro: "Informe um termo de busca."
            });
        }

        const livros = await searchBooks(String(q));

        return res.json(livros);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            erro: "Erro ao buscar livros."
        });
    }
}

export async function buscarLivroPorId(req: Request, res: Response) {
    try {
        const livro = await searchBookById(String(req.params.id));

        return res.json(livro);
    } catch (error) {
        console.error(error);

        return res.status(404).json({
            erro: "Livro não encontrado."
        });
    }
}
