import { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { checkAuth } from "@/lib/auth";
import { SIDEBAR_ENTRIES } from "@/lib/constants";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await checkAuth(false);

  const entries = SIDEBAR_ENTRIES.filter((entry) => !entry.requireAdmin || user.role === "ADMIN");

  return (
    <SidebarProvider>
      <AppSidebar entries={entries} />
      <SidebarInset>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
