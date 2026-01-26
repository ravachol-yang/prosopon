"use server";

import {
  bindProfileTextureParams,
  createInviteParam,
  createProfileParam,
  loginParams,
  registerParams,
  updatePasswordParams,
  updateUserInfoParams,
  uploadTextureParams,
  verifyInviteCodeParam,
} from "@/lib/schema";
import prisma from "@/lib/prisma";
import { checkPassword, hashPassword } from "@/lib/password";
import { checkAdmin, checkAuth, signin } from "@/lib/auth";
import { z } from "zod";
import { getStorage } from "@/lib/storage";
import { redirect } from "next/navigation";
import { getContentHash } from "@/lib/crypto";
import { Buffer } from "node:buffer";

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

  const user = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      verified,
      invitedBy: inviteId ? { connect: { code: inviteId } } : undefined,
    },
  });

  await signin({ id: user.id, role: user.role, verified: user.verified });

  redirect("/dashboard");
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

  await signin({ id: user.id, role: user.role, verified: user.verified });

  redirect("/dashboard");
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

export async function createProfile(data: z.infer<typeof createProfileParam>) {
  const user = await checkAuth();
  if (user.error) return { success: false, message: user.error };

  if (user.role !== "ADMIN") {
    const profiles = await prisma.profile.findMany({
      where: { userId: user.id },
    });

    if (profiles.length >= 3) {
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
  const buffer = Buffer.from(await file.arrayBuffer());
  const hash = getContentHash(buffer);

  const existing = await prisma.texture.findFirst({ where: { hash } });
  if (!existing) {
    await storage.put(hash, buffer, file.type);
  }

  const existingPersonal = await prisma.texture.findFirst({
    where: {
      uploaderId: user.id,
      hash,
    },
  });

  if (!existingPersonal) {
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

  return { success: true, data: existingPersonal };
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
  const user = await checkAdmin();
  if (user.error) return { success: false, message: user.error };

  const validated = createInviteParam.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Invalid input" };
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
