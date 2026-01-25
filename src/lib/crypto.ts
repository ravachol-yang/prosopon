import { createHash } from "node:crypto";

export function getContentHash(data: Buffer) {
  return createHash("sha256").update(data).digest("hex");
}
