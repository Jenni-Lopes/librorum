import prisma from "../prisma/client";

type DadosCadastro = {
    nome: string;
    email: string;
    senha: string;
};

type DadosLogin = {
    email: string;
    senha: string;
};

export async function cadastrarUsuarioService(dados: DadosCadastro) {
    const usuarioExistente = await prisma.user.findUnique({
        where: {
            email: dados.email,
        },
    });

    if (usuarioExistente) {
        throw new Error("Este e-mail já está cadastrado.");
    }

    return await prisma.user.create({
        data: dados,
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

    if (!usuario || usuario.senha !== dados.senha) {
        throw new Error("Usuário ou senha inválidos.");
    }

    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
    };
}
