import { ReadingStatus } from "@prisma/client";
import prisma from "../prisma/client";
import { searchBookById } from "./book.service";

export async function adicionarLivroService(
    googleBookId: string,
    userId: number,
    status: ReadingStatus = ReadingStatus.WANT_TO_READ,
    nota?: number
) {
    const livroExistente = await prisma.library.findUnique({
        where: {
            userId_googleBookId: {
                userId,
                googleBookId,
            },
        },
    });

    if (livroExistente) {
        return await prisma.library.update({
            where: {
                id: livroExistente.id,
            },
            data: {
                status,
                nota,
            },
        });
    }

    const livroGoogle = await searchBookById(googleBookId);

    return await prisma.library.create({
        data: {
            googleBookId,
            titulo: livroGoogle.titulo,
            autores: livroGoogle.autores,
            imagem: livroGoogle.imagem,
            paginas: livroGoogle.paginas,
            status,
            nota,
            userId,
        },
    });
}

export async function listarBibliotecaService(userId: number) {
    return await prisma.library.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            googleBookId: true,
            titulo: true,
            autores: true,
            imagem: true,
            paginas: true,
            paginaAtual: true,
            percentual: true,
            nota: true,
            status: true,
        },
    });
}

export async function buscarLivroService(id: number, userId: number) {
    return await prisma.library.findFirst({
        where: {
            id,
            userId,
        },
    });
}

export async function atualizarProgressoService() {
    // Implementar quando o progresso de leitura for usado na interface.
}

export async function atualizarStatusService(
    id: number,
    userId: number,
    status: ReadingStatus
) {
    const livro = await buscarLivroService(id, userId);

    if (!livro) {
        throw new Error("Livro nao encontrado.");
    }

    return await prisma.library.update({
        where: {
            id: livro.id,
        },
        data: {
            status,
        },
    });
}

export async function removerLivroService(id: number, userId: number) {
    const livro = await buscarLivroService(id, userId);

    if (!livro) {
        throw new Error("Livro nao encontrado.");
    }

    return await prisma.library.delete({
        where: {
            id: livro.id,
        },
    });
}
