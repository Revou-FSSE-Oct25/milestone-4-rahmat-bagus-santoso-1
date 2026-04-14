//import { Account } from '@prisma/client';

export class Account {
    id!: number;
    accountNumber!: string;
    balance!: number;
    createdAt!: Date;
    updatedAt!: Date;
    userId!: number;
}
