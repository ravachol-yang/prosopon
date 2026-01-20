import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { register } from "@/lib/actions";
import prisma from "@/lib/prisma";

let inviteCode: string;

beforeAll(async () => {
  await prisma.invite.deleteMany({});
  await prisma.user.deleteMany({});

  const user = await prisma.user.create({
    data: {
      email: "exist@example.com",
      password: "password",
      verified: true,
      role: "ADMIN",
    },
  });

  const invite = await prisma.invite.create({
    data: {
      createdBy: {
        connect: { id: user.id },
      },
    },
  });

  inviteCode = invite.code;
});

afterAll(async () => {
  await prisma.invite.deleteMany({});
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

describe("registerWithInvite", () => {
  it("should create a verified user on valid code", async () => {
    const email = "verified@example.com";

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", "12345678");
    formData.set("inviteCode", inviteCode);

    const result = await register(formData);

    expect(result.success).toBe(true);

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        invitedBy: true,
      },
    });

    expect(user?.verified).toBe(true);
    expect(user?.invitedBy?.code).toBe(inviteCode);
  });

  it("should fail on an used-up code", async () => {
    const email = "used-up@example.com";

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", "12345678");
    formData.set("inviteCode", inviteCode);

    const result = await register(formData);

    expect(result.message).toBe("Invites used up");
  });

  it("should fail on an invalid code", async () => {
    const email = "invalid@example.com";

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", "12345678");
    formData.set("inviteCode", "invalid");

    const result = await register(formData);

    expect(result.message).toBe("Invalid invite code");
  });
});
