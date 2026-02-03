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

export async function findAllTextureWithInfo(where?) {
  return prisma.texture.findMany({
    where,
    include: {
      _count: {
        select: {
          profileSkin: true,
          profileCape: true,
        },
      },
      uploader: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}
