import { ReactNode } from "react";
import { PageHeader } from "@/components/page-header";

export default async function DashboardSectionLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageHeader parent="dashboard" parentUrl="" />
      <div className="p-6 max-w-400">{children}</div>
    </>
  );
}
