import { z } from "zod";

export const registerParams = z.object({
  email: z.email(),
  password: z.string().min(8),
  inviteCode: z.string().optional(),
});
