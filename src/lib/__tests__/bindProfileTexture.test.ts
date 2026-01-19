import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { setCurrentUserMock } from "@/lib/__tests__/mock";
import { bindProfileTexture } from "@/lib/actions";

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

  setCurrentUserMock({ sub: userId, role: "USER", verified: true });
});

afterAll(async () => {
  await prisma.texture.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe("bindProfileTexture", () => {
  it("should bind a profile and a skin", async () => {
    const profile = await bindProfileTexture({
      profileId,
      textureId: skinId,
      type: "SKIN",
    });

    expect(profile.skinId).toBe(skinId);
  });
  it("should bind a profile and a cape", async () => {
    const profile = await bindProfileTexture({
      profileId,
      textureId: capeId,
      type: "CAPE",
    });

    expect(profile.capeId).toBe(capeId);
  });
  it("should unbind if textureId is undefined", async () => {
    const profile = await bindProfileTexture({
      profileId,
      textureId: undefined,
      type: "SKIN",
    });

    expect(profile.skinId).toBeNull();
  });
  it("should fail on wrong type", async () => {
    await expect(
      bindProfileTexture({
        profileId,
        textureId: skinId,
        type: "CAPE",
      }),
    ).rejects.toThrow("Wrong type");
  });
  it("should fail not owning a profile", async () => {
    await expect(
      bindProfileTexture({
        profileId: wrongProfileId,
        textureId: skinId,
        type: "SKIN",
      }),
    ).rejects.toThrow("Don't own profile");
  });
});
