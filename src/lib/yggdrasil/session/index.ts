import { SessionStore } from "@/lib/yggdrasil/session/types";
import { RedisStore } from "@/lib/yggdrasil/session/redis-store";
import { DbStore } from "@/lib/yggdrasil/session/db-store";

let store: SessionStore;

const useRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

if (useRedis) {
  store = new RedisStore(
    process.env.UPSTASH_REDIS_REST_URL as string,
    process.env.UPSTASH_REDIS_REST_TOKEN as string,
  );
} else {
  store = new DbStore();
}

export { store as sessionStore };
