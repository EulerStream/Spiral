import "server-only";

import {cache} from "react";
import {auth} from "@/auth";
import {ExtendedUser} from "@/types/next-auth";

export const getCurrentUser = cache(async (): Promise<ExtendedUser | undefined> => {
  const session = await auth();
  if (!session?.user) {
    return undefined;
  }
  return session.user;
});