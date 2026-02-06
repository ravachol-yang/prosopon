import { Session, SessionStore } from "@/lib/yggdrasil/session/types";
import prisma from "@/lib/prisma";

export class DbStore implements SessionStore {
  async get(serverId: string): Promise<Session | null> {
    const session = await prisma.$queryRaw<Session[]>`
        DELETE FROM "YggSession" WHERE id = ${serverId} RETURNING *
    `;
    return session[0] &&
      session[0].createdAt &&
      new Date().getTime() - session[0].createdAt.getTime() < 30 * 1000
      ? { ...session[0] }
      : null;
  }

  async save(serverId: string, profileId: string, profileName: string, ip?: string): Promise<void> {
    try {
      await prisma.$executeRaw`
        INSERT INTO "YggSession" ("id", "profileId", "profileName", "ip")
        VALUES (${serverId},${profileId},${profileName},${ip ?? null})
      `;
    } catch (error) {
      console.error(error);
    }
  }
}
