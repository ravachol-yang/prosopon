import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/yggdrasil/jwt";
import { processTexture } from "@/lib/server/texture-process";
import { Buffer } from "node:buffer";
import { SkinModel, TextureType } from "@/generated/prisma/enums";
import { getContentHash } from "@/lib/crypto";
import prisma from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { untrimUuid } from "@/lib/yggdrasil/utils";

export async function PUT(req: NextRequest, { params }) {
  const { uuid, textureType } = await params;

  let verified;
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (token) verified = await verifyAccessToken(token);
  if (!verified || verified.semiExpire || verified.payload!.profileId !== uuid) {
    return new NextResponse(null, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const model = formData.get("model") as string;

  let buffer;
  try {
    buffer = await processTexture(
      Buffer.from(await file.arrayBuffer()),
      textureType === "skin" ? TextureType.SKIN : TextureType.CAPE,
    );
  } catch (e) {
    return NextResponse.json({ status: 401 });
  }

  let finalModel;
  if (textureType === "skin") {
    finalModel = model === "slim" ? SkinModel.SLIM : SkinModel.DEFAULT;
  }

  const hash = getContentHash(buffer);
  const existing = await prisma.texture.findFirst({ where: { hash } });
  if (!existing) {
    await storage.put(hash, buffer, file.type);
  }

  const existingPersonal = await prisma.texture.findFirst({
    where: {
      uploaderId: verified.payload.userId,
      hash,
    },
  });

  let texture;
  if (!existingPersonal) {
    texture = await prisma.texture.create({
      data: {
        name: file.name,
        type: textureType === "skin" ? TextureType.SKIN : TextureType.CAPE,
        hash: hash,
        model: textureType === "skin" ? finalModel : undefined,
        uploader: { connect: { id: verified.payload.userId } },
      },
    });
  } else texture = existingPersonal;

  if (texture) {
    const profile = await prisma.profile.update({
      where: { uuid: untrimUuid(uuid) },
      data: {
        skin: textureType === "skin" ? { connect: { id: texture.id } } : undefined,
        cape: textureType === "cape" ? { connect: { id: texture.id } } : undefined,
      },
    });
    if (profile) {
      return new NextResponse(null, { status: 204 });
    }
  }
  return new NextResponse(null, { status: 500 });
}

export async function DELETE(req: NextRequest, { params }) {
  const { uuid, textureType } = await params;

  let verified;
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (token) verified = await verifyAccessToken(token);
  if (!verified || verified.semiExpire || verified.payload!.profileId !== uuid) {
    return new NextResponse(null, { status: 401 });
  }

  const profile = await prisma.profile.update({
    where: { uuid: untrimUuid(uuid) },
    data: {
      skin: textureType === "skin" ? { disconnect: true } : undefined,
      cape: textureType === "cape" ? { disconnect: true } : undefined,
    },
  });

  if (profile) {
    return new NextResponse(null, { status: 204 });
  }
  return new NextResponse(null, { status: 500 });
}
