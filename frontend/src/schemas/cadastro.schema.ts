import { z } from "zod";

export const cadastroSchema = z
  .object({
    email: z.email("Email inválido"),
    senha: z.string().min(6, "Senha precisa no mínimo 6 caracteres"),
    confSenha: z.string(),
  })
  .refine((d) => d.senha === d.confSenha, {
    message: "As senhas não coincidem",
    path: ["confSenha"],
  });
