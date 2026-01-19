import { vi } from "vitest";
import * as userModule from "@/lib/user";

export function setCurrentUserMock(user: {
  sub: string;
  role: "ADMIN" | "USER";
  verified: boolean;
}) {
  vi.spyOn(userModule, "getCurrentUser").mockImplementation(async () => user);
}
