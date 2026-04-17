import { Role } from "@prisma/client";

export type AuthenticatedRequest = Request & {
  user: {
    userId: number;
    email: string;
    role: Role;
  };
};