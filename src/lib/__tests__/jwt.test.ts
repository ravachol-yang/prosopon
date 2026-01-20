import { describe, expect, it, vi } from "vitest";
import { createToken, parseToken } from "@/lib/jwt";
import { checkAuth, getCurrentUser } from "@/lib/auth";

const getCookieMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: getCookieMock,
  }),
}));

it("should create and verify token", async () => {
  const token = await createToken({
    id: "userId",
    role: "ADMIN",
    verified: true,
  });

  expect(token).toBeDefined();

  const payload = await parseToken(token);

  expect(payload.sub).toBe("userId");
});

describe("auth", async () => {
  const token = await createToken({
    id: "userId",
    role: "ADMIN",
    verified: true,
  });

  getCookieMock.mockReturnValue({ value: token });

  it("should get token from cookies and get current user", async () => {
    const user = await getCurrentUser();
    expect(user?.sub).toBe("userId");
  });

  it("check user verified", async () => {
    const user = await checkAuth();

    expect(user.id).toBe("userId");
  });
});
