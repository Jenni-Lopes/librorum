import { z } from "zod";

export const cadastroSchema = z
  .object({
    nome: z.string().trim().min(1, "Nome de usuario e obrigatorio"),
    email: z.email("Email invalido"),
    senha: z.string().min(6, "Senha precisa no minimo 6 caracteres"),
    confSenha: z.string(),
  })
  .refine((d) => d.senha === d.confSenha, {
    message: "As senhas nao coincidem",
    path: ["confSenha"],
  });
