import { Role } from "@prisma/client";
import { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user: {
    userId: number;
    email: string;
    role: Role;
  };
};