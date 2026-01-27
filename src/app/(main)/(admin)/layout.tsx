import { ReactNode } from "react";
import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await checkAuth();

  if (user.error) {
    redirect("/login");
  }

  // check user is Admin
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <div className="min-h-screen">{children}</div>;
}
