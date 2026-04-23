import { AccountStatus, AccountType } from '@prisma/client';

export class Account {
    id!: number;
    accountNumber!: string;
    balance!: number;
    type!: AccountType;
    status!: AccountStatus;
    createdAt!: Date;
    updatedAt!: Date;
    userId!: number;
}
