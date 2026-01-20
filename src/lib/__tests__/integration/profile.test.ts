import { describe, beforeAll, afterAll, expect, it, vi } from "vitest";
import { hashPassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { createProfile } from "@/lib/actions";
import * as auth from "@/lib/auth";

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
    vi.spyOn(auth, "checkAuth").mockResolvedValue({ id: adminId, role: "ADMIN", verified: true });

    const result = await createProfile({ name });

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe(name);
    expect(result.data?.userId).toBe(adminId);
  });

  it("should fail on duplicate name", async () => {
    const result = await createProfile({ name });

    expect(result.success).toBe(false);
    expect(result.message).toBe("Profile already exists");
  });

  it("should fail on too many profiles", async () => {
    vi.spyOn(auth, "checkAuth").mockResolvedValue({ id: userId, role: "USER", verified: true });

    await createProfile({ name: "New" });
    const result = await createProfile({ name: "Many" });

    expect(result.success).toBe(false);
    expect(result.message).toBe("Too many profiles");
  });

  it("should fail on unverified user", async () => {
    vi.spyOn(auth, "checkAuth").mockResolvedValue({ error: "Require Verification" });

    const result = await createProfile({ name: "Unverified" });

    expect(result.success).toBe(false);
    expect(result.message).toBe("Require Verification");
  });
});
