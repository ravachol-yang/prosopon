import { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { checkAuth } from "@/lib/auth";
import { SIDEBAR_ENTRIES } from "@/lib/constants";
import { findUserById } from "@/queries/user";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const currentAuth = await checkAuth(false);

  const entries = SIDEBAR_ENTRIES.filter(
    (entry) => !entry.requireAdmin || currentAuth.role === "ADMIN",
  );

  const user = await findUserById(currentAuth.id!);

  return (
    <SidebarProvider>
      <AppSidebar entries={entries} user={user} />
      <SidebarInset className="bg-accent">
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
