import { MemStorage } from "@/lib/storage/mem";
import { Storage } from "@/lib/storage/types";
import { S3Storage } from "@/lib/storage/s3";

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

  const s3_endpoint = process.env.S3_ENDPOINT;
  const s3_access_key = process.env.S3_ACCESS_KEY_ID;
  const s3_secret_key = process.env.S3_SECRET_ACCESS_KEY;
  const s3_bucket = process.env.S3_BUCKET_NAME;

  if (s3_endpoint && s3_access_key && s3_secret_key && s3_bucket) {
    storage = new S3Storage(s3_endpoint, s3_access_key, s3_secret_key, s3_bucket);
    return storage;
  }

  throw new Error("No storage available");
}
