"use server";

import {
  bindProfileTextureParams,
  createInviteParam,
  createProfileParam,
  loginParams,
  registerParams,
  uploadTextureParams,
} from "@/lib/schema";
import prisma from "@/lib/prisma";
import { checkPassword, hashPassword } from "@/lib/password";
import { createToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { checkAuth } from "@/lib/auth";
import { z } from "zod";
import { getStorage } from "@/lib/storage";

const UPLOAD_MAX_SIZE = 1024 * 1024 * 2;
const ALLOWED_TYPES = ["image/png"];

export async function register(data: z.infer<typeof registerParams>) {
  const validated = registerParams.safeParse(data);

  if (!validated.success) {
    return { success: false, message: validated.error.message };
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

export async function login(data: z.infer<typeof loginParams>) {
  const validated = loginParams.safeParse(data);

  if (!validated.success) {
    return { success: false, message: validated.error.message };
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
  const user = await checkAuth();
  if (user.error) return { success: false, message: user.error };

  if (user.role !== "ADMIN") {
    const profiles = await prisma.profile.findMany({
      where: { userId: user.id },
    });

    if (profiles.length >= 1) {
      return { success: false, message: "Too many profiles" };
    }
  }

  const validated = createProfileParam.safeParse(data);
  if (!validated.success) {
    return { success: false, message: validated.error.message };
  }
  const { name } = validated.data;

  const existing = await prisma.profile.findUnique({
    where: { name },
  });

  if (existing) return { success: false, message: "Profile already exists" };

  const profile = await prisma.profile.create({
    data: {
      name,
      user: {
        connect: { id: user.id },
      },
    },
  });

  return { success: true, data: profile };
}

export async function uploadTexture(formData: FormData) {
  const user = await checkAuth();
  if (user.error) return { success: false, message: user.error };

  const raw = {
    name: formData.get("name"),
    type: formData.get("type"),
    model: formData.get("model"),
  };

  const file = formData.get("file") as File | null;
  if (!file || file.size > UPLOAD_MAX_SIZE || !ALLOWED_TYPES.includes(file.type))
    return { success: false, message: "File is required" };

  const validated = uploadTextureParams.safeParse(raw);
  if (!validated.success) {
    return { success: false, message: validated.error.message };
  }
  const { name, type, model } = validated.data;

  const storage = getStorage();
  const hash = "fakehash-" + Date.now();
  const buffer = new Uint8Array(await file.arrayBuffer());

  await storage.put(hash, buffer, file.type);

  const texture = await prisma.texture.create({
    data: {
      name: name ? name : hash,
      type,
      hash,
      model: type === "SKIN" ? model : undefined,
      uploader: { connect: { id: user.id } },
    },
  });

  return { success: true, data: texture };
}

export async function bindProfileTexture(data: z.infer<typeof bindProfileTextureParams>) {
  const user = await checkAuth();
  if (user.error) return { success: false, message: user.error };

  const { profileId, textureId, type } = bindProfileTextureParams.parse(data);

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  });

  if (!profile || profile.userId != user.id) {
    return { success: false, message: "Don't own profile" };
  }

  if (textureId) {
    const texture = await prisma.texture.findUnique({
      where: { id: textureId },
    });

    if (!texture) {
      return { success: false, message: "Texture not found" };
    }

    if (texture.type != type) {
      return { success: false, message: "Wrong type" };
    }
  }

  const updatedProfile = await prisma.profile.update({
    where: { id: profileId },
    data:
      type === "SKIN"
        ? { skin: textureId ? { connect: { id: textureId } } : { disconnect: true } }
        : { cape: textureId ? { connect: { id: textureId } } : { disconnect: true } },
  });

  return { success: true, data: updatedProfile };
}

export async function createInvite(data: z.infer<typeof createInviteParam>) {
  const user = await checkAuth();
  if (user.error) return { success: false, message: user.error };

  if (user.role !== "ADMIN") return { success: false, message: "No permission" };

  const validated = createInviteParam.safeParse(data);
  if (!validated.success) {
    return { success: false, message: validated.error.message };
  }

  const { maxInvites } = validated.data;

  const invite = await prisma.invite.create({
    data: {
      maxInvites: maxInvites,
      createdBy: {
        connect: { id: user.id },
      },
    },
  });

  return { success: true, data: invite };
}
