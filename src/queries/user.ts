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

export async function findUserByIdWithProfiles(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      profiles: true,
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

export async function findAllUsersWithInfo() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      verified: true,
      _count: {
        select: {
          profiles: true,
          closet: true,
        },
      },
      invitedBy: {
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      createdAt: true,
    },
  });
}
