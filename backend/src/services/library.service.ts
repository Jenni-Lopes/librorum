import prisma from "../prisma/client";
import { searchBookById } from "./book.service";

type DadosLivroGoogle = {
    titulo: string;
    autores?: string;
    imagem?: string;
    paginas?: number;
};

async function verificarLivroDuplicado(
    googleBookId: string,
    userId: number
): Promise<void> {
    const livro = await prisma.library.findFirst({
        where: {
            googleBookId,
            userId,
        },
    });

    if (livro) {
        throw new Error("Este livro já está na biblioteca.");
    }
}

async function buscarDadosGoogleBooks(
    googleBookId: string
): Promise<DadosLivroGoogle> {
    const livro = await searchBookById(googleBookId);

    return {
        titulo: livro.titulo,
        autores: livro.autores,
        imagem: livro.imagem,
        paginas: livro.paginas,
    };
}

function montarDadosLivro(
    googleBookId: string,
    userId: number,
    dados: DadosLivroGoogle
) {
    return {
        googleBookId,
        titulo: dados.titulo,
        autores: dados.autores,
        imagem: dados.imagem,
        paginas: dados.paginas,
        paginaAtual: 0,
        percentual: 0,
        userId,
    };
}

async function salvarLivro(
    dados: ReturnType<typeof montarDadosLivro>
) {
    return await prisma.library.create({
        data: dados,
    });
}


export async function adicionarLivroService(
    googleBookId: string,
    userId: number
) {
    await verificarLivroDuplicado(googleBookId, userId);

    const dadosGoogle = await buscarDadosGoogleBooks(googleBookId);

    const dadosLivro = montarDadosLivro(
        googleBookId,
        userId,
        dadosGoogle
    );

    return await salvarLivro(dadosLivro);
}

/*FUNÇÕES QUE IMPLEMENTAREMOS NAS PRÓXIMAS ETAPAS*/

export async function listarBibliotecaService(userId: number) {
    return await prisma.library.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
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
    // Implementaremos depois
}

export async function atualizarStatusService() {
    // Implementaremos depois
}

export async function removerLivroService(id: number, userId: number) {
    const livro = await buscarLivroService(id, userId);

    if (!livro) {
        throw new Error("Livro não encontrado.");
    }

    return await prisma.library.delete({
        where: {
            id: livro.id,
        },
    });
}
