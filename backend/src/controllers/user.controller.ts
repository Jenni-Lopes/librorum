import { Request, Response } from "express";
import {
  cadastrarUsuarioService,
  loginUsuarioService,
} from "../services/user.service";

export async function cadastro(req: Request, res: Response) {
  try {
    const { nome, email, senha } = req.body;

    const usuario = await cadastrarUsuarioService(nome, email, senha);

    res.json(usuario);
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Erro ao criar usuário.",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;

    const resposta = await loginUsuarioService(email, senha);

    res.cookie("token", resposta.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      sucess: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Erro",
    });
  }
}

export async function sair(_req: Request, res: Response) {
  res.clearCookie("token");
  res.json({
    sucess: true,
  });
}
