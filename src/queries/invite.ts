import prisma from "@/lib/prisma";

export async function findAllInvitesWithUsedBy() {
  return prisma.invite.findMany({
    include: {
      usedBy: true,
    },
  });
}
