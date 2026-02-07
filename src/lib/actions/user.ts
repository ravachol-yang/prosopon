"use server";

import {
  loginParams,
  registerParams,
  updatePasswordParams,
  updateUserInfoParams,
  verifyInviteCodeParam,
} from "@/lib/schema";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { checkPassword, hashPassword } from "@/lib/password";
import { checkAuth, signin } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function register(data: z.infer<typeof registerParams>) {
  const validated = registerParams.safeParse(data);

  if (!validated.success) {
    return { success: false, message: "Invalid input" };
  }

  const { email, password, inviteCode } = validated.data;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return { success: false, message: `User with email: ${email} already exists` };
  }

  let verified = false;
  let inviteId;
  if (inviteCode) {
    const invite = await prisma.invite.findUnique({
      where: { code: inviteCode },
      include: { usedBy: true },
    });

    if (!invite) {
      return { success: false, message: "Invalid invite code" };
    }

    if (invite.usedBy.length >= invite.maxInvites) {
      return { success: false, message: "Invites used up" };
    }

    verified = true;
    inviteId = invite.code;
  }

  const passwordHash = hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      verified,
      invitedBy: inviteId ? { connect: { code: inviteId } } : undefined,
    },
  });

  await signin({ id: user.id, role: user.role, verified: user.verified });

  redirect("/");
}

export async function login(data: z.infer<typeof loginParams>) {
  const validated = loginParams.safeParse(data);

  if (!validated.success) {
    return { success: false, message: "Invalid input" };
  }

  const { email, password } = validated.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: false, message: "Invalid Credentials" };
  }

  if (!checkPassword(password, user.password)) {
    return { success: false, message: "Invalid Credentials" };
  }

  await signin({ id: user.id, role: user.role, verified: user.verified });

  redirect("/");
}

export async function verifyInviteCode(data: z.infer<typeof verifyInviteCodeParam>) {
  const user = await checkAuth(false);

  if (!user || user.verified) {
    return { success: false, message: "Wrong user" };
  }

  const validated = verifyInviteCodeParam.safeParse(data);

  if (!validated.success) {
    return { success: false, message: "Invalid Input" };
  }

  const { inviteCode } = validated.data;

  const invite = await prisma.invite.findUnique({
    where: { code: inviteCode },
    include: { usedBy: true },
  });

  if (!invite) {
    return { success: false, message: "Invalid invite code" };
  }

  if (invite.usedBy.length >= invite.maxInvites) {
    return { success: false, message: "Invites used up" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      invitedBy: {
        connect: { code: inviteCode },
      },
      verified: true,
    },
  });

  redirect("/logout");
}

export async function updateUserInfo(data: z.infer<typeof updateUserInfoParams>) {
  const user = await checkAuth();

  if (!user) {
    return { success: false, message: "Require login" };
  }

  const validated = updateUserInfoParams.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Invalid Input" };
  }

  const { name, email } = validated.data;

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name,
      email,
    },
  });

  return { success: true };
}

export async function updatePassword(data: z.infer<typeof updatePasswordParams>) {
  const auth = await checkAuth();
  if (!auth) {
    return { success: false, message: "Require login" };
  }

  const validated = updatePasswordParams.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Invalid Input" };
  }

  const { oldPassword, newPassword } = validated.data;

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
  });

  if (!user) {
    return { success: false, message: "Invalid Credentials" };
  }

  if (!checkPassword(oldPassword, user.password)) {
    return { success: false, message: "Invalid Credentials" };
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashPassword(newPassword),
    },
  });

  if (!updated || !checkPassword(newPassword, updated.password)) {
    return { success: false, message: "update Failed" };
  }

  redirect("/logout");
}
