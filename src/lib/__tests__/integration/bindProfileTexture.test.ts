import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { bindProfileTexture } from "@/lib/actions";
import * as auth from "@/lib/auth";

let userId: string;
let profileId: string;
let wrongProfileId: string;

let skinId: string;
let capeId: string;

beforeAll(async () => {
  await prisma.texture.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});

  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      password: hashPassword("password"),
      role: "USER",
      verified: true,
    },
  });
  userId = user.id;

  const profile = await prisma.profile.create({
    data: {
      name: "Profile",
      userId: userId,
    },
  });
  profileId = profile.id;

  const wrongUser = await prisma.user.create({
    data: {
      email: "wrong@example.com",
      password: hashPassword("password"),
      role: "USER",
      verified: true,
    },
  });

  const wrongProfile = await prisma.profile.create({
    data: {
      name: "wrongProfile",
      userId: wrongUser.id,
    },
  });
  wrongProfileId = wrongProfile.id;

  const skin = await prisma.texture.create({
    data: {
      name: "Skin",
      type: "SKIN",
      hash: "fakehash-" + Date.now(),
      model: "DEFAULT",
      uploaderId: userId,
    },
  });
  skinId = skin.id;

  const cape = await prisma.texture.create({
    data: {
      name: "Cape",
      type: "CAPE",
      hash: "fakehash1-" + Date.now(),
      uploaderId: userId,
    },
  });
  capeId = cape.id;

  vi.spyOn(auth, "checkAuth").mockResolvedValue({ id: userId, role: "USER", verified: true });
});

afterAll(async () => {
  await prisma.texture.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe("bindProfileTexture", () => {
  it("should bind a profile and a skin", async () => {
    const result = await bindProfileTexture({
      profileId,
      textureId: skinId,
      type: "SKIN",
    });

    const profile = result.data;
    expect(profile?.skinId).toBe(skinId);
  });
  it("should bind a profile and a cape", async () => {
    const result = await bindProfileTexture({
      profileId,
      textureId: capeId,
      type: "CAPE",
    });

    const profile = result.data;
    expect(profile?.capeId).toBe(capeId);
  });
  it("should unbind if textureId is undefined", async () => {
    const result = await bindProfileTexture({
      profileId,
      textureId: undefined,
      type: "SKIN",
    });

    const profile = result.data;
    expect(profile?.skinId).toBeNull();
  });
  it("should fail on wrong type", async () => {
    const result = await bindProfileTexture({
      profileId,
      textureId: skinId,
      type: "CAPE",
    });

    expect(result.message).toBe("Wrong type");
  });
  it("should fail not owning a profile", async () => {
    const result = await bindProfileTexture({
      profileId: wrongProfileId,
      textureId: skinId,
      type: "SKIN",
    });

    expect(result.message).toBe("Don't own profile");
  });
});
