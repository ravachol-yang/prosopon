import prisma from "@/lib/prisma";

export async function findAllInvitesWithInfo() {
  return prisma.invite.findMany({
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      usedBy: true,
    },
  });
}
