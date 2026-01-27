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
    const result = (await this.client.get(SESSION_PREFIX + ":session:" + serverId)) as string;
    if (!result) {
      return null;
    }
    await this.client.del(serverId);
    return JSON.parse(result) as Session;
  }

  async save(serverId: string, profileId: string, profileName: string, ip?: string) {
    await this.client.set(
      SESSION_PREFIX + ":session:" + serverId,
      JSON.stringify({ profileId, profileName, ip }),
      { ex: 30 },
    );
  }
}
