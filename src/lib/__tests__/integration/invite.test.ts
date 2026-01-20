import { afterAll, beforeAll, describe, vi, it, expect } from "vitest";
import * as auth from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createInvite } from "@/lib/actions";

let adminId: string;
let userId: string;

beforeAll(async () => {
  await prisma.invite.deleteMany({});
  await prisma.user.deleteMany({});

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "password",
      verified: true,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      password: "password",
      verified: true,
      role: "USER",
    },
  });

  adminId = admin.id;
  userId = user.id;
});

afterAll(async () => {
  await prisma.invite.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe("createInvite", () => {
  it("should succeed on admin role", async () => {
    vi.spyOn(auth, "checkAuth").mockResolvedValue({ id: adminId, role: "ADMIN", verified: true });
    const invite = await createInvite({ maxInvites: 3 });

    expect(invite.data?.maxInvites).toBe(3);
  });

  it("should fail on user role", async () => {
    vi.spyOn(auth, "checkAuth").mockResolvedValue({ id: userId, role: "USER", verified: true });
    const invite = await createInvite({ maxInvites: 3 });

    expect(invite.message).toBe("No permission");
  });

  it("should set maxInvite to 1 without this param", async () => {
    vi.spyOn(auth, "checkAuth").mockResolvedValue({ id: adminId, role: "ADMIN", verified: true });
    const invite = await createInvite({});

    expect(invite.data?.maxInvites).toBe(1);
  });
});
