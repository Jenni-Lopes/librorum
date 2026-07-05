import { Request, Response } from "express";

export async function minhaBiblioteca(req: Request, res: Response) {
  res.json({
    mensagem: "Minha biblioteca"
  });
}

export async function buscarLivro(req: Request, res: Response) {
  res.json({
    mensagem: "Buscar livro"
  });
}

export async function adicionarLivro(req: Request, res: Response) {
  res.json({
    mensagem: "Adicionar livro"
  });
}

export async function atualizarProgresso(req: Request, res: Response) {
  res.json({
    mensagem: "Atualizar progresso"
  });
}

export async function atualizarStatus(req: Request, res: Response) {
  res.json({
    mensagem: "Atualizar status"
  });
}

export async function removerLivro(req: Request, res: Response) {
  res.json({
    mensagem: "Remover livro"
  });
}