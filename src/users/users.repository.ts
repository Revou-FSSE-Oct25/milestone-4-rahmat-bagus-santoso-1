import { Injectable } from "@nestjs/common";
import { Prisma } from '@prisma/client';
import { PrismaService } from "../prisma.service";

@Injectable()
export class UsersRepository {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    create(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({data});
    }

    findAll() {
        return this.prisma.user.findMany({
            // select: {
            //     id: true,
            //     fullName: true,
            //     email: true,
            //     role: true,
            //     createdAt: true,
            //     updatedAt: true,
            // },
            orderBy: {
                id: 'asc',
            },
        });
    }

    findById(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            // select: {
            //     id: true,
            //     fullName: true,
            //     email: true,
            //     role: true,
            //     createdAt: true,
            //     updatedAt: true,
            // },
        });
    }

    update(id: number, data: Prisma.UserUpdateInput) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    remove(id: number) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}