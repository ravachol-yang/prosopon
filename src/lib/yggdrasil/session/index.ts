import { SessionStore } from "@/lib/yggdrasil/session/types";
import { RedisStore } from "@/lib/yggdrasil/session/redis-store";
import { DbStore } from "@/lib/yggdrasil/session/db-store";

let store: SessionStore;

const useRedis = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

if (useRedis) {
  store = new RedisStore(
    process.env.KV_REST_API_URL as string,
    process.env.KV_REST_API_TOKEN as string,
  );
} else {
  store = new DbStore();
}

export { store as sessionStore };
