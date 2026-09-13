import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export function getDb(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  if (!globalForPrisma.prisma) {
    try {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      });
    } catch (e) {
      console.warn("PrismaClient initialization error:", e);
      return null;
    }
  }
  return globalForPrisma.prisma;
}

// Backward compatibility proxy for existing imports if any remain
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getDb();
    if (!client) {
      throw new Error(
        `Prisma database client requested '${String(prop)}', but DATABASE_URL is not configured.`
      );
    }
    const val = (client as any)[prop];
    return typeof val === "function" ? val.bind(client) : val;
  },
});
