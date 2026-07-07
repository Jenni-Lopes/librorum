import prisma from "../prisma/client";

export async function buscarMetaAtualService(userId: number, year: number) {
    return await prisma.goal.findUnique({
        where: {
            userId_year: {
                userId,
                year,
            },
        },
    });
}

export async function salvarMetaAtualService(userId: number, year: number, target: number) {
    return await prisma.goal.upsert({
        where: {
            userId_year: {
                userId,
                year,
            },
        },
        update: {
            target,
        },
        create: {
            userId,
            year,
            target,
        },
    });
}
