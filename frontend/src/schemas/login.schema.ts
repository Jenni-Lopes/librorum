import {z} from "zod";

export const loginSchema = z.object({
    email: z.email("Email inválido"),
    senha: z.string().min(6,"Senha deve ter pelo menos 6 caracteres")
});