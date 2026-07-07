import { NextFunction, Request, Response } from "express";
import { validarToken } from "../utils/jwt";

export type UsuarioAutenticado = {
    id: number;
    nome: string;
    email: string;
};

export type RequestAutenticada = Request & {
    usuario?: UsuarioAutenticado;
};

export function autenticarToken(
    req: RequestAutenticada,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null;

    if (!token) {
        return res.status(401).json({
            erro: "Token não informado.",
        });
    }

    try {
        req.usuario = validarToken(token);
        return next();
    } catch (error) {
        const mensagem = error instanceof Error ? error.message : "Token inválido.";

        return res.status(401).json({
            erro: mensagem,
        });
    }
}
