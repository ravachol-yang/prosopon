import { jwtVerify, SignJWT } from "jose";

const alg = "HS256";

const secret = new TextEncoder().encode(process.env.APP_SECRET);

export async function createToken(user: { id: string; role: "ADMIN" | "USER"; verified: boolean }) {
  return await new SignJWT({ role: user.role, verified: user.verified })
    .setProtectedHeader({ alg })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("15d")
    .sign(secret);
}

export async function parseToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (e) {
    console.warn("Parse Failed");
    return null;
  }
}
