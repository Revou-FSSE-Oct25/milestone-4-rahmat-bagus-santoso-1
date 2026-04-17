import { TransactionStatus, TransactionType } from "@prisma/client";

export class Transaction {
    id!: number;
    type!: TransactionType;
    amount!: number;
    description?: string | null;
    status!: TransactionStatus;
    createdAt!: Date;
    updatedAt!: Date;
    sourceAccountId?: number | null;
    destinationAccountId?: number | null;

}
