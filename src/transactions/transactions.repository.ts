import { Injectable } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class TransactionsRepository {
    constructor( private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.transaction.findMany({
            orderBy: {
                id: 'desc'
            },
        });
    }

    findAllByUserId(userId: number) {
        return this.prisma.transaction.findMany({
            where: {
                OR: [
                    {
                        sourceAccount: {
                            userId,
                        },
                    },
                    {
                        destinationAccount: {
                            userId,
                        },
                    },
                ],
            },
            orderBy: {
                id: 'desc',
            },
        });
    }

    findById(id: number) {
        return this.prisma.transaction.findUnique({
            where: { id },
            include: {
                sourceAccount: true,
                destinationAccount: true,
            },
        });
    }

    findAccountById(id: number) {
        return this.prisma.account.findUnique({
            where: { id },
        });
    }

    createTransaction(
        tx: PrismaClient,
        data: Prisma.TransactionCreateInput,
    ) {
        return tx.transaction.create({ data });
    }

    updateAccountBalance(
        tx: PrismaClient,
        accountId: number,
        balance: number,
    ) {
        return tx.account.update({
            where: { id: accountId },
            data: { balance },
        });
    }

    async runInTransaction<T>(
        callback: (tx: PrismaClient) => Promise<T>,
    ) : Promise<T> {
        return this.prisma.$transaction((tx) => callback(tx as PrismaClient));
    }
}