import prisma from "../prisma/client";

export async function listarReviewsService(googleBookId: string) {
    return await prisma.review.findMany({
        where: {
            googleBookId,
        },
        orderBy: {
            updatedAt: "desc",
        },
        select: {
            id: true,
            googleBookId: true,
            userId: true,
            rating: true,
            text: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    nome: true,
                },
            },
        },
    });
}

export async function listarReviewsUsuarioService(userId: number) {
    return await prisma.review.findMany({
        where: {
            userId,
        },
        orderBy: {
            updatedAt: "desc",
        },
        select: {
            id: true,
            googleBookId: true,
            userId: true,
            rating: true,
            text: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    nome: true,
                },
            },
        },
    });
}

export async function salvarReviewService(
    googleBookId: string,
    userId: number,
    rating: number,
    text: string
) {
    return await prisma.review.upsert({
        where: {
            userId_googleBookId: {
                userId,
                googleBookId,
            },
        },
        update: {
            rating,
            text,
        },
        create: {
            googleBookId,
            userId,
            rating,
            text,
        },
        select: {
            id: true,
            googleBookId: true,
            userId: true,
            rating: true,
            text: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    nome: true,
                },
            },
        },
    });
}

export async function deletarReviewService(id: number, userId: number) {
    const review = await prisma.review.findFirst({
        where: {
            id,
            userId,
        },
    });

    if (!review) {
        throw new Error("Avaliacao nao encontrada.");
    }

    return await prisma.review.delete({
        where: {
            id: review.id,
        },
    });
}
