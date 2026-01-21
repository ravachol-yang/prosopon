import { ReactNode } from "react";
import { PageHeader } from "@/components/PageHeader";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageHeader parentPage={{ name: "仪表盘", link: "/dashboard" }} pageName="角色管理" />
      {children}
    </>
  );
}
