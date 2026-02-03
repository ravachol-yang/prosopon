import prisma from "@/lib/prisma";

export async function findAllInvitesWithInfo(where?) {
  return prisma.invite.findMany({
    where,
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
