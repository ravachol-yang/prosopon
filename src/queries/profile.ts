import prisma from "@/lib/prisma";

export async function findProfileByUserId(id: string) {
  return prisma.profile.findMany({
    where: { userId: id },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function findProfileByIdWithTextures(id: string) {
  return prisma.profile.findUnique({
    where: { id },
    include: {
      skin: true,
      cape: true,
    },
  });
}
