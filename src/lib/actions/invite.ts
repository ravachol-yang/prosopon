"use server";

import { createInviteParam } from "@/lib/schema";
import { checkAdmin } from "@/lib/auth";
import { z } from "zod";
import prisma from "@/lib/prisma";

export async function createInvite(data: z.infer<typeof createInviteParam>) {
  const user = await checkAdmin();
  if (user.error) return { success: false, message: user.error };

  const validated = createInviteParam.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Invalid input" };
  }

  const { maxInvites } = validated.data;

  const invite = await prisma.invite.create({
    data: {
      maxInvites: maxInvites,
      createdBy: {
        connect: { id: user.id },
      },
    },
  });

  return { success: true, data: invite };
}
