import { cookies } from "next/headers";
import { createToken, parseToken } from "@/lib/jwt";
import { Role } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { checkPassword } from "@/lib/password";

export async function checkCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      password: true,
      verified: true,
    },
  });

  if (!user || !checkPassword(password, user.password)) return false;
  return user;
}

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

export async function checkAdmin() {
  const user = await checkAuth();

  if (user.error) return { error: user.error };

  if (user.role !== "ADMIN") return { error: "Require Admin" };

  return {
    id: user.id,
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
