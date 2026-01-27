import { createHash, createSign } from "node:crypto";

export const RSA_PUBKEY = Buffer.from(process.env.RSA_PUBKEY_B64!, "base64").toString("utf-8");
const RSA_PRIVKEY = Buffer.from(process.env.RSA_PRIVKEY_B64!, "base64").toString("utf-8");

export function getContentHash(data: Buffer) {
  return createHash("sha256").update(data).digest("hex");
}

export function signValue(value: string) {
  try {
    const sign = createSign("SHA1");
    sign.update(value);
    return sign.sign(RSA_PRIVKEY, "base64");
  } catch (e) {
    return undefined;
  }
}
