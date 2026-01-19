import { afterAll, beforeAll, describe, it, expect, vi } from "vitest";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { login } from "@/lib/actions";

const email = "test@example.com";
const password = "password";

const setCookieMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => ({
    set: setCookieMock,
  }),
}));

beforeAll(async () => {
  await prisma.user.deleteMany({});
  await prisma.user.create({
    data: {
      email,
      password: hashPassword(password),
    },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe("login", () => {
  it("should succeed and set jwt cookie", async () => {
    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);

    const result = await login(formData);
    expect(result.success).toBe(true);

    expect(setCookieMock).toHaveBeenCalledOnce();

    const [name, token] = setCookieMock.mock.calls[0];

    expect(name).toBe("prosopon.session");
    expect(typeof token).toBe("string");
  });

  it("should fail on wrong password", async () => {
    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", "wrong_password");

    const result = await login(formData);
    expect(typeof result.error).toBe("string");
  });

  it("should fail on non-exist user", async () => {
    const formData = new FormData();
    formData.set("email", "non-exist@example.com");
    formData.set("password", password);

    const result = await login(formData);
    expect(typeof result.error).toBe("string");
  });
});
