import { z } from "zod";
import { SkinModel, TextureType } from "@/generated/prisma/enums";

export const registerParams = z.object({
  email: z.email(),
  password: z.string().min(8),
  inviteCode: z.string().optional(),
});

export const loginParams = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const createProfileParam = z.object({
  name: z.string().min(2).max(32),
});

export const uploadTextureParams = z.object({
  name: z.string().min(1).max(32).optional(),
  type: z.enum(TextureType),
  model: z.enum(SkinModel).optional(),
});

export const bindProfileTextureParams = z.object({
  profileId: z.string(),
  textureId: z.string().optional(),
  type: z.enum(TextureType),
});

export const createInviteParam = z.object({
  maxInvites: z.number().min(1).optional(),
});
