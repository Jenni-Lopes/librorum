import jwt from "jsonwebtoken";
import { Request, Response,NextFunction } from "express";
import { AuthPayload } from "../tipos/auth-payload";


export function authMiddleware(req:Request, res:Response, next: NextFunction)
{
    let token = req.cookies.token;

    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
        }
    }

    if(!token)
    {
        return res.status(400).json({
            message: "Não autenticado",
        });
    }

    try{
        const payload =jwt.verify(token,process.env.JWT_SECRET!) as AuthPayload
        
        res.locals.user = payload;

        next();
    }
    catch{
        return res.status(401).json({
            message: "Token inválido",
        });
    }
}
