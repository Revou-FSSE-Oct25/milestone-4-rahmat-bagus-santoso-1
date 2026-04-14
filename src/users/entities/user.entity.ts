import { Role } from "@prisma/client";
import { Account } from "src/accounts/entities/account.entity";

export class User {
    id!: number;
    fullName!: string;
    email!: string;
    password!: string;
    role!: Role;
    createdAt!: Date;
    account?: Account[]; 
}
