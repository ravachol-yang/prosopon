import prisma from "@/lib/prisma";

export async function findProfileByUuidAndUserId(profileUuid: string, userId: string) {
  return prisma.profile.findUnique({
    where: { uuid: profileUuid, userId },
    include: {
      skin: { select: { hash: true, model: true } },
      cape: { select: { hash: true } },
    },
  });
}

export async function findProfileByUuidWithTextures(uuid: string) {
  return prisma.profile.findUnique({
    where: { uuid },
    include: {
      skin: { select: { hash: true, model: true } },
      cape: { select: { hash: true } },
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
