import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { register } from "@/lib/actions";
import prisma from "@/lib/prisma";

beforeAll(async () => {
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe("register", () => {
  it("creates an unverified user without a invite code", async () => {
    const email = "unverified@example.com";

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", "12345678");

    const result = await register(formData);

    expect(result.success).toBe(true);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    expect(user).toBeDefined();
    expect(user?.verified).toBe(false);
  });
});
