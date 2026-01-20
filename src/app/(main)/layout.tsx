import { ReactNode } from "react";
import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MainLayout({ children }: { children: ReactNode }) {
  // check user logged in but don't require verification
  const user = await checkAuth(false);

  if (user.error) {
    redirect("/login");
  }

  return <div className="min-h-screen">{children}</div>;
}
