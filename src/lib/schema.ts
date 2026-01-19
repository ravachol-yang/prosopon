import { z } from "zod";

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
