import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.APP_SECRET);
const alg = "HS256";

export async function createToken(user: { id: string; role: "ADMIN" | "USER"; verified: boolean }) {
  return await new SignJWT({ role: user.role, verified: user.verified })
    .setProtectedHeader({ alg })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("15d")
    .sign(secret);
}

export async function parseToken(token: string) {
  const { payload } = await jwtVerify(token, secret);

  return payload;
}
