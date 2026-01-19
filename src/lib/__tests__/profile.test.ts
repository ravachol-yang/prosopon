import { describe, beforeAll, afterAll, expect, it } from "vitest";
import { hashPassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { setCurrentUserMock } from "@/lib/__tests__/mock";
import { createProfile } from "@/lib/actions";

let adminId: string;
let userId: string;

beforeAll(async () => {
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashPassword("password"),
      role: "ADMIN",
      verified: true,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      password: hashPassword("password"),
      role: "USER",
      verified: true,
    },
  });
  adminId = admin.id;
  userId = user.id;
});

afterAll(async () => {
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe("createProfile", () => {
  const name = "Mock";

  it("should create a profile", async () => {
    setCurrentUserMock({ sub: adminId, role: "ADMIN", verified: true });

    const profile = await createProfile({ name });

    expect(profile.name).toBe(name);
    expect(profile.userId).toBe(adminId);
  });

  it("should fail on duplicate name", async () => {
    await expect(createProfile({ name })).rejects.toThrow("Profile already exists");
  });

  it("should fail on too many profiles", async () => {
    setCurrentUserMock({ sub: userId, role: "USER", verified: true });

    await createProfile({ name: "New" });
    await expect(createProfile({ name: "Many" })).rejects.toThrow("Too many profiles");
  });

  it("should fail on unverified user", async () => {
    setCurrentUserMock({ sub: userId, role: "USER", verified: false });

    await expect(createProfile({ name: "Unverified" })).rejects.toThrow("Require Verification");
  });
});
