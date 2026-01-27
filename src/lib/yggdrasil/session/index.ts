import { SessionStore } from "@/lib/yggdrasil/session/types";
import { RedisStore } from "@/lib/yggdrasil/session/redis-store";

let store: SessionStore;

const useRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

if (useRedis) {
  store = new RedisStore(
    process.env.UPSTASH_REDIS_REST_URL as string,
    process.env.UPSTASH_REDIS_REST_TOKEN as string,
  );
} else {
  throw new Error("Redis configuration missing.");
}

export { store as sessionStore };
