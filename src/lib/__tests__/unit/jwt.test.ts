import { expect, it } from "vitest";
import { createToken, parseToken } from "@/lib/jwt";

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
