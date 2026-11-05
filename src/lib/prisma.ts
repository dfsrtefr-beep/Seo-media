import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function withTimeout(url: string | undefined): string | undefined {
  if (!url) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}connect_timeout=10&pool_timeout=15`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: withTimeout(process.env.DATABASE_URL),
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
