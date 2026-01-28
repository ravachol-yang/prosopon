import { SessionStore, Session } from "@/lib/yggdrasil/session/types";
import { Redis } from "@upstash/redis";
import { SESSION_PREFIX } from "@/lib/constants";

export class RedisStore implements SessionStore {
  private client: Redis;

  constructor(url, token) {
    this.client = new Redis({
      url,
      token,
    });
  }

  async get(serverId: string) {
    const session = await this.client.get<Session>(SESSION_PREFIX + ":session:" + serverId);

    if (!session) {
      return null;
    }
    await this.client.del(SESSION_PREFIX + ":session:" + serverId);
    return session;
  }

  async save(serverId: string, profileId: string, profileName: string, ip?: string) {
    await this.client.set(
      SESSION_PREFIX + ":session:" + serverId,
      JSON.stringify({ profileId, profileName, ip }),
      { ex: 30 },
    );
  }
}
