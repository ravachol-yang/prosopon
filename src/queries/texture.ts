import prisma from "@/lib/prisma";

export async function findTextureByIdWithOwnProfiles(id: string, userId: string) {
  return prisma.texture.findUnique({
    where: {
      id,
      uploaderId: userId,
    },
    include: {
      profileSkin: {
        where: {
          userId,
        },
      },
      profileCape: {
        where: {
          userId,
        },
      },
    },
  });
}
