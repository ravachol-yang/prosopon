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

  try {
    const existing = await prisma.texture.findFirst({ where: { hash }, select: { id: true } });
    if (!existing) {
      await storage.put(hash, buffer, file.type);
    }

    const connectTexture = {
      connectOrCreate: {
        create: {
          name: file.name,
          type: textureType === "skin" ? TextureType.SKIN : TextureType.CAPE,
          hash: hash,
          model: textureType === "skin" ? finalModel : undefined,
          uploader: { connect: { id: verified.payload.userId } },
        },
        where: {
          uploaderId_hash: {
            uploaderId: verified.payload.userId,
            hash,
          },
        },
      },
    };

    await prisma.profile.update({
      where: {
        uuid: untrimUuid(uuid),
      },
      data: {
        skin: textureType === "skin" ? connectTexture : undefined,
        cape: textureType === "cape" ? connectTexture : undefined,
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return new NextResponse(null, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }) {
  const { uuid, textureType } = await params;

  let verified;
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (token) verified = await verifyAccessToken(token);
  if (!verified || verified.semiExpire || verified.payload!.profileId !== uuid) {
    return new NextResponse(null, { status: 401 });
  }

  try {
    await prisma.profile.update({
      where: { uuid: untrimUuid(uuid) },
      data: {
        skin: textureType === "skin" ? { disconnect: true } : undefined,
        cape: textureType === "cape" ? { disconnect: true } : undefined,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return new NextResponse(null, { status: 500 });
  }
}
