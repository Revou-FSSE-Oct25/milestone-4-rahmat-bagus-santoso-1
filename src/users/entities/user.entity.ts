import { Role } from "@prisma/client";
import type { Account } from "../../accounts/entities/account.entity";

export class User {
    id!: number;
    fullName!: string;
    email!: string;
    //password!: string;
    role!: Role;
    createdAt!: Date;
    account?: Account[]; 
}
