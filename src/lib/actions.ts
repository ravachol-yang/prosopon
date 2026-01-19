"use server";

import {
  bindProfileTextureParams,
  createProfileParam,
  loginParams,
  registerParams,
  uploadTextureParams,
} from "@/lib/schema";
import prisma from "@/lib/prisma";
import { checkPassword, hashPassword } from "@/lib/password";
import { createToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/user";
import { z } from "zod";

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

export async function createProfile(data: z.infer<typeof createProfileParam>) {
  const user = await getCurrentUser();

  if (!user || !user.sub) throw new Error("Not logged in");

  if (!user.verified) throw new Error("Require Verification");

  if (user.role !== "ADMIN") {
    const profiles = await prisma.profile.findMany({
      where: { userId: user.sub },
    });

    if (profiles.length >= 1) {
      throw new Error("Too many profiles");
    }
  }

  const { name } = createProfileParam.parse(data);

  const existing = await prisma.profile.findUnique({
    where: { name },
  });

  if (existing) throw new Error("Profile already exists");

  return prisma.profile.create({
    data: {
      name,
      user: {
        connect: { id: user.sub },
      },
    },
  });
}

export async function uploadTexture(formData: FormData) {
  const user = await getCurrentUser();

  if (!user || !user.sub) throw new Error("Not logged in");

  if (!user.verified) throw new Error("Require Verification");

  const raw = {
    name: formData.get("name"),
    type: formData.get("type"),
    model: formData.get("model"),
  };

  const file = formData.get("file") as File | null;
  if (!file) throw new Error("File is required");

  const { name, type, model } = uploadTextureParams.parse(raw);

  // TODO: upload to S3 compatible
  const hash = "fakehash-" + Date.now();

  return prisma.texture.create({
    data: {
      name: name ? name : hash,
      type,
      hash,
      model: type === "SKIN" ? model : undefined,
      uploader: { connect: { id: user.sub } },
    },
  });
}

export async function bindProfileTexture(data: z.infer<typeof bindProfileTextureParams>) {
  const user = await getCurrentUser();
  if (!user || !user.sub) throw new Error("Not logged in");
  if (!user.verified) throw new Error("Require Verification");

  const { profileId, textureId, type } = bindProfileTextureParams.parse(data);

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  });

  if (!profile || profile.userId != user.sub) {
    throw new Error("Don't own profile");
  }

  const texture = await prisma.texture.findUnique({
    where: { id: textureId },
  });

  if (!texture) {
    throw new Error("Texture not found");
  }

  if (texture.type != type) {
    throw new Error("Wrong type");
  }

  return prisma.profile.update({
    where: { id: profileId },
    data: type === "SKIN" ? { skinId: textureId } : { capeId: textureId },
  });
}
