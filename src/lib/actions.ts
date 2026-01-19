import { registerParams } from "@/lib/schema";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function register(formData: FormData) {
  const data = Object.fromEntries(formData);
  const validated = registerParams.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.message };
  }

  const { email, password } = validated.data;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return { error: `User with email: ${email} already exists` };
  }

  const passwordHash = hashPassword(password);

  await prisma.user.create({
    data: {
      email,
      password: passwordHash,
    },
  });

  return { success: true };
}
