import { Role } from "@prisma/client";
import { Exclude } from "class-transformer";
import type { Account } from "../../accounts/entities/account.entity";

export class User {
    id!: number;
    fullName!: string;
    email!: string;
    @Exclude()
    password!: string;
    role!: Role;
    createdAt!: Date;
    account?: Account[]; 
}
