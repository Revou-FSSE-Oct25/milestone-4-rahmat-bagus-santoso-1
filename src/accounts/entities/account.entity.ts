import { AccountStatus } from '@prisma/client';

export class Account {
    id!: number;
    accountNumber!: string;
    balance!: number;
    status!: AccountStatus;
    createdAt!: Date;
    updatedAt!: Date;
    userId!: number;
}
