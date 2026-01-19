import { cookies } from "next/headers";
import { parseToken } from "@/lib/jwt";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("prosopon.session")?.value;
  if (!token) return null;

  return await parseToken(token);
}
