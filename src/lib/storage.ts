import { MemStorage } from "@/lib/storage/mem";
import { Storage } from "@/lib/storage/types";

let storage: Storage | null = null;

export function getStorage() {
  if (storage) return storage;

  const env = process.env.NODE_ENV || "development";
  const use_mem = process.env.USE_MEM_STORAGE || "false";
  if (env !== "production" && use_mem === "true") {
    console.warn("using in-memory storage");
    storage = new MemStorage();
    return storage;
  }

  throw new Error("No storage available");
}
