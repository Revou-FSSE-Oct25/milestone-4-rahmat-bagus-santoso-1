import { Injectable } from "@nestjs/common";
import { Prisma } from '@prisma/client';
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AccountsRepository{
    constructor(
        private readonly prisma: PrismaService
    ) {}

    create(data: Prisma.AccountCreateInput) {
        return this.prisma.account.create({data});
    }

    findAll() {
        return this.prisma.account.findMany({
            orderBy: {
                id: 'asc',
            },
        });
    }

    findById(id: number) {
        return this.prisma.account.findUnique({
            where: { id },
        });
    }

    update(id: number, data: Prisma.AccountUpdateInput) {
        return this.prisma.account.update({
            where: { id },
            data,
        })
    }

    remove(id: number) {
        return this.prisma.user.delete({
            where: { id },
        })
    }
}