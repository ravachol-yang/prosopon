import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { uploadTexture } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { setCurrentUserMock } from "@/lib/__tests__/mock";

let userId: string;

beforeAll(async () => {
  await prisma.texture.deleteMany({});
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
  setCurrentUserMock({ sub: userId, role: "USER", verified: true });
});

afterAll(async () => {
  await prisma.texture.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe("uploadTexture", () => {
  it("should create a texture", async () => {
    const file = new File(["dummy"], "skin.png", { type: "image/png" });
    const formData = new FormData();
    formData.set("name", "Skin");
    formData.set("type", "SKIN");
    formData.set("model", "DEFAULT");
    formData.set("file", file);

    const result = await uploadTexture(formData);

    expect(result.success).toBe(true);

    const texture = result.data;
    expect(texture?.name).toBe("Skin");
    expect(texture?.type).toBe("SKIN");
    expect(texture?.model).toBe("DEFAULT");
    expect(texture?.hash).toBeDefined();
    expect(texture?.uploaderId).toBe(userId);
  });

  it("should fail without a file", async () => {
    const formData = new FormData();
    formData.append("name", "NoFile");
    formData.append("type", "SKIN");

    const result = await uploadTexture(formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe("File is required");
  });

  it("should not set model if uploading a cape", async () => {
    const file = new File(["dummy"], "cape.png", { type: "image/png" });
    const formData = new FormData();
    formData.set("name", "Cape");
    formData.set("type", "CAPE");
    formData.set("model", "SLIM");
    formData.set("file", file);

    const result = await uploadTexture(formData);
    expect(result.success).toBe(true);

    const texture = result.data;
    expect(texture?.name).toBe("Cape");
    expect(texture?.model).not.toBe("SLIM");
  });
});
