import prisma from "@/lib/prisma";

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      verified: true,
    },
  });
}

export async function findUserByIdWithProfilesAndTextures(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      verified: true,
      profiles: true,
      closet: true,
      createdAt: true,
    },
  });
}
