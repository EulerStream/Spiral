import {prisma} from "@/lib/db";

export async function fetchKeyCount(): Promise<number> {
  return prisma.token.count();
}