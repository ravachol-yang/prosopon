import prisma from "@/lib/prisma";

export async function findProfileByUuidAndUserId(profileUuid: string, userId: string) {
  return prisma.profile.findUnique({
    where: { uuid: profileUuid, userId },
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
