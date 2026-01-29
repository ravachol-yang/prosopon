import { createHash } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import { TOKEN_HALF_LIFE } from "@/lib/constants";

const secret = new TextEncoder().encode(process.env.APP_SECRET);
const alg = "HS256";

export async function createAccessToken(userId: string, clientToken: string, profileId?: string) {
  const clientTokenHash = createHash("sha256").update(clientToken).digest("hex");

  return new SignJWT({
    userId,
    clientTokenHash,
    profileId,
  })
    .setProtectedHeader({ alg: alg })
    .setIssuedAt()
    .setExpirationTime("15d")
    .sign(secret);
}

export async function verifyAccessToken(token: string, clientToken?: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    const iat = payload.iat as number;
    const now = Math.floor(Date.now() / 1000);

    const semiExpire = now > iat + TOKEN_HALF_LIFE;

    let clientMatch = false;
    if (clientToken) {
      clientMatch =
        createHash("sha256").update(clientToken).digest("hex") === payload.clientTokenHash;
    }

    return {
      valid: true,
      semiExpire,
      clientMatch,
      payload: payload as { userId: string; clientTokenHash: string; profileId: string },
    };
  } catch (e) {
    return { valid: false };
  }
}
