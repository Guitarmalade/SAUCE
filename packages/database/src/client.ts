import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __saucePrisma: PrismaClient | undefined;
}

export function createPrismaClient() {
  if (!globalThis.__saucePrisma) {
    globalThis.__saucePrisma = new PrismaClient();
  }

  return globalThis.__saucePrisma;
}

