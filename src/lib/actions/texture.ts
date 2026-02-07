"use server";

import { checkAuth } from "@/lib/auth";
import { TextureType } from "@/generated/prisma/enums";
import { bindProfileTextureParams, uploadTextureParams } from "@/lib/schema";
import { processTexture } from "@/lib/server/texture-process";
import { Buffer } from "node:buffer";
import { getContentHash } from "@/lib/crypto";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { UPLOAD_MAX_SIZE } from "@/lib/constants";

const ALLOWED_TYPES = ["image/png"];

export async function uploadTexture(formData: FormData) {
  const user = await checkAuth();
  if (user.error || !user.id) return { success: false, message: user.error };

  const raw = {
    name: formData.get("name"),
    type: formData.get("type"),
    model: formData.get("type") === TextureType.SKIN ? formData.get("model") : undefined,
  };

  const file = formData.get("file") as File | null;
  if (!file || file.size > UPLOAD_MAX_SIZE || !ALLOWED_TYPES.includes(file.type))
    return { success: false, message: "File is required" };

  const validated = uploadTextureParams.safeParse(raw);
  if (!validated.success) {
    return { success: false, message: "Invalid input" };
  }
  const { name, type, model } = validated.data;

  let buffer;
  try {
    buffer = await processTexture(Buffer.from(await file.arrayBuffer()), type);
  } catch (e) {
    return { success: false, message: "Invalid Input" };
  }

  const hash = getContentHash(buffer);

  try {
    const existing = await prisma.texture.findFirst({ where: { hash }, select: { id: true } });
    if (!existing) {
      console.log("not existing");
      await storage.put(hash, buffer, file.type);
    }

    const result = await prisma.texture.upsert({
      where: {
        uploaderId_hash: {
          uploaderId: user.id,
          hash,
        },
      },
      update: {
        name: name || hash,
        type,
        model: type === TextureType.SKIN ? model : undefined,
      },
      create: {
        name: name || hash,
        type,
        hash,
        model: type === TextureType.SKIN ? model : undefined,
        uploader: { connect: { id: user.id } },
      },
    });

    return { success: true, data: result };
  } catch (e) {
    return { success: false, message: "Internal Error" };
  }
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
