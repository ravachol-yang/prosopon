import { describe, expect, it, vi } from "vitest";
import { createToken } from "@/lib/jwt";
import { checkAuth, getCurrentUser } from "@/lib/auth";

const getCookieMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: getCookieMock,
  }),
}));

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
