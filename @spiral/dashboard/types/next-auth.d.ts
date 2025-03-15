import {UserRole} from "@prisma/client";
import {User} from "next-auth";

export type ExtendedUser = User & {
  role: UserRole;
  eulerAccountId?: number
};

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    eulerAccountId?: number
  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
