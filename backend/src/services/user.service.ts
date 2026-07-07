import prisma from "../prisma/client";
import bcrypt from "bcrypt";

type DadosCadastro = {
    nome: string;
    email: string;
    senha: string;
};

type DadosLogin = {
    email: string;
    senha: string;
};

const SALT_ROUNDS = 10;

export async function cadastrarUsuarioService(dados: DadosCadastro) {
    const usuarioExistente = await prisma.user.findUnique({
        where: {
            email: dados.email,
        },
    });

    if (usuarioExistente) {
        throw new Error("Este e-mail já está cadastrado.");
    }

    const senhaCriptografada = await bcrypt.hash(
        dados.senha,
        SALT_ROUNDS
    );

    return await prisma.user.create({
        data: {
            nome: dados.nome,
            email: dados.email,
            senha: senhaCriptografada,
        },
        select: {
            id: true,
            nome: true,
            email: true,
            createdAt: true,
        },
    });
}

export async function loginUsuarioService(dados: DadosLogin) {
    const usuario = await prisma.user.findUnique({
        where: {
            email: dados.email,
        },
    });

    if (!usuario) {
        throw new Error("Usuário ou senha inválidos.");
    }

    const senhaCorreta = await bcrypt.compare(
        dados.senha,
        usuario.senha
    );

    if (!senhaCorreta) {
        throw new Error("Usuário ou senha inválidos.");
    }

    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
    };
}