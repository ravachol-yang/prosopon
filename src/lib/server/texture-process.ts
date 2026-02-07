import sharp from "sharp";
import { TextureType } from "@/generated/prisma/enums";
import { UPLOAD_MAX_SIZE } from "@/lib/constants";

export async function processTexture(fileBuffer: Buffer, textureType: TextureType) {
  if (fileBuffer.length > UPLOAD_MAX_SIZE) {
    throw new Error("Too large");
  }

  const image = sharp(fileBuffer);
  const metadata = await image.metadata();

  if (metadata.format !== "png") {
    throw new Error("require PNG");
  }

  const w = metadata.width || 0;
  const h = metadata.height || 0;
  let isValidSize = false;

  if (textureType === TextureType.SKIN) {
    isValidSize = w > 0 && w === h && w % 64 === 0;
  } else if (textureType === TextureType.CAPE) {
    isValidSize = w === 64 && h === 32;
  }

  if (!isValidSize) {
    throw new Error("Invalid texture");
  }

  return await image
    .rotate()
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      force: true,
    })
    .toBuffer();
}
