import { cookies } from "next/headers";
import { parseToken } from "@/lib/jwt";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("prosopon.session")?.value;
  if (!token) return null;

  return await parseToken(token);
}

export async function checkAuth(verify = true) {
  const user = await getCurrentUser();

  if (!user) return { error: "Not logged in" };

  if (verify && !user.verified) return { error: "Require Verification" };

  return {
    id: user.sub,
    role: user.role,
    verified: user.verified,
  };
}
