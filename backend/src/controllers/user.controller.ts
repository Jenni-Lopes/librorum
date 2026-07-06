import { Request, Response } from "express";
import {
    cadastrarUsuarioService,
    loginUsuarioService,
} from "../services/user.service";

export async function cadastro(req: Request, res: Response) {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "nome, email e senha são obrigatórios.",
            });
        }

        const usuario = await cadastrarUsuarioService({ nome, email, senha });

        return res.status(201).json(usuario);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ erro: error.message });
        }

        return res.status(500).json({ erro: "Erro ao criar usuário." });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: "email e senha são obrigatórios.",
            });
        }

        const usuario = await loginUsuarioService({ email, senha });

        return res.status(200).json({
            token: String(usuario.id),
            user: usuario,
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(401).json({ erro: error.message });
        }

        return res.status(500).json({ erro: "Erro ao fazer login." });
    }
}

export async function sair(_req: Request, res: Response) {
    return res.status(200).json({
        mensagem: "Logout realizado com sucesso.",
    });
}
