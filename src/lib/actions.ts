"use server";

import { loginParams, registerParams } from "@/lib/schema";
import prisma from "@/lib/prisma";
import { checkPassword, hashPassword } from "@/lib/password";
import { createToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function register(formData: FormData) {
  const data = Object.fromEntries(formData);
  const validated = registerParams.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.message };
  }

  const { email, password, inviteCode } = validated.data;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return { error: `User with email: ${email} already exists` };
  }

  let verified = false;
  let inviteId;
  if (inviteCode) {
    const invite = await prisma.invite.findUnique({
      where: { code: inviteCode },
      include: { usedBy: true },
    });

    if (!invite) {
      return { error: "Invalid invite code" };
    }

    if (invite.usedBy.length >= invite.maxInvites) {
      return { error: "Invites used up" };
    }

    verified = true;
    inviteId = invite.code;
  }

  const passwordHash = hashPassword(password);

  await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      verified,
      invitedBy: inviteId ? { connect: { code: inviteId } } : undefined,
    },
  });

  return { success: true };
}

export async function login(formData: FormData) {
  const data = Object.fromEntries(formData);
  const validated = loginParams.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.message };
  }

  const { email, password } = validated.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "User not found" };
  }

  if (!checkPassword(password, user.password)) {
    return { error: "Invalid Credentials" };
  }

  const token = await createToken({
    id: user.id,
    role: user.role,
    verified: user.verified,
  });

  const cookieStore = await cookies();
  cookieStore.set("prosopon.session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 15,
  });

  return { success: true };
}
