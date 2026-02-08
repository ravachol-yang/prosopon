"use server";

import { createProfileParam } from "@/lib/schema";
import { checkAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MAX_PROFILES, SITE_DOMAIN } from "@/lib/constants";
import { z } from "zod";
import { v5 as uuidv5 } from "uuid";
import { createId } from "@paralleldrive/cuid2";
import { Prisma } from "@/generated/prisma/client";

export async function createProfile(data: z.infer<typeof createProfileParam>) {
  const user = await checkAuth();
  if (user.error) return { success: false, message: user.error };

  if (user.role !== "ADMIN") {
    const profiles = await prisma.profile.findMany({
      where: { userId: user.id },
    });

    if (profiles.length >= MAX_PROFILES) {
      return { success: false, message: "Too many profiles" };
    }
  }

  const validated = createProfileParam.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Invalid Input" };
  }
  const { name } = validated.data;

  const existing = await prisma.profile.findUnique({
    where: { name },
  });

  if (existing) return { success: false, message: "Profile already exists" };

  const SITE_NAMESPACE = uuidv5(SITE_DOMAIN, uuidv5.DNS);

  const id = createId();
  const uuid = uuidv5(id, SITE_NAMESPACE);

  try {
    const profile = await prisma.profile.create({
      data: {
        id,
        name,
        uuid,
        user: {
          connect: { id: user.id },
        },
      },
    });

    return { success: true, data: profile };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return { success: false, message: "Profile already exists" };
      }
    }
    console.error(e);
    return { success: false, message: "Something went wrong" };
  }
}

export async function updateProfileName(id: string, data: z.infer<typeof createProfileParam>) {
  const user = await checkAuth();
  if (user.error) return { success: false, message: user.error };

  const validated = createProfileParam.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Invalid Input" };
  }
  const { name } = validated.data;

  const profile = await prisma.profile.update({
    where: { id },
    data: {
      name,
    },
  });

  if (!profile) return { success: false, message: "Update failed" };
  return { success: true, data: profile };
}
