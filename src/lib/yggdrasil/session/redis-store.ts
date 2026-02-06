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
    const script = `
      local data = redis.call('GET', KEYS[1])
      if data then
        redis.call('DEL', KEYS[1])
      end
      return data
    `;

    const result = await this.client.eval(script, [SESSION_PREFIX + ":session:" + serverId], []);

    if (typeof result === "object") {
      try {
        return result as Session;
      } catch {
        return null;
      }
    } else return null;
  }

  async save(serverId: string, profileId: string, profileName: string, ip?: string) {
    await this.client.set(
      SESSION_PREFIX + ":session:" + serverId,
      JSON.stringify({ profileId, profileName, ip }),
      { ex: 30 },
    );
  }
}
