import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function cadastrarUsuarioService(
  nome: string,
  email: string,
  senha: string,
) {
  const usuarioExistente = await prisma.user.findUnique({
    where: { email },
  });

  if (usuarioExistente) {
    throw new Error("Este e-mail já está cadastrado.");
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  return prisma.user.create({
    data: {
      nome,
      email,
      senha: senhaHash,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      createdAt: true,
    },
  });
}

export async function loginUsuarioService(email: string, senha: string) {
  const usuario = await prisma.user.findUnique({
    where: { email },
  });

  if (!usuario) {
    throw new Error("Email ou senha inválidos.");
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (!senhaCorreta) {
    throw new Error("Email ou senha inválidos.");
  }

  const token = jwt.sign(
    {
      id: usuario.id,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    },
  );

  return {
    token,
  };
}
