import { cookies } from "next/headers";
import { createToken, parseToken } from "@/lib/jwt";
import { Role } from "@/generated/prisma/enums";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("prosopon.session")?.value;
  if (!token) return null;

  return await parseToken(token);
}

export async function checkAuth(verify = true) {
  const user = await getCurrentUser();

  if (!user) return { error: "Not logged in" };

  if (verify && !user.verified) return { error: "Require Verification" };

  return {
    id: user.sub,
    role: user.role,
    verified: user.verified,
  };
}

export async function signin({
  id,
  role,
  verified,
}: {
  id: string;
  role: Role;
  verified: boolean;
}) {
  const token = await createToken({
    id,
    role,
    verified,
  });

  const cookieStore = await cookies();
  cookieStore.set("prosopon.session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 15,
  });
}
