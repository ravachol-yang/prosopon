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

export const verifyInviteCodeParam = z.object({
  inviteCode: z.string(),
});

export const updateUserInfoParams = z.object({
  name: z.string().min(1, "不少于一个字符").max(32, "不超过32个字符").optional(),
  email: z.email("邮箱一定要是邮箱!").optional(),
});

export const updatePasswordParams = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(8, "密码不少于8位"),
});

export const createProfileParam = z.object({
  name: z
    .string()
    .min(2, "至少2个字符")
    .max(16, "不超过16个字符")
    .regex(/^[a-zA-Z0-9_]+$/, "只能包含字母、数字和下划线"),
});

export const uploadTextureParams = z.object({
  name: z.string().min(1).max(128).optional(),
  type: z.enum(TextureType),
  model: z.enum(SkinModel).optional(),
});

export const bindProfileTextureParams = z.object({
  profileId: z.string(),
  textureId: z.string().optional(),
  type: z.enum(TextureType),
});

export const createInviteParam = z.object({
  maxInvites: z.number().min(1, "邀请数量不能小于1").optional(),
});
