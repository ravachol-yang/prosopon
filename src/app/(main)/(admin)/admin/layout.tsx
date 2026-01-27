import { ReactNode } from "react";
import { PageHeader } from "@/components/page-header";

export default async function AdminSectionLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageHeader parent="admin" parentUrl="admin/content" />
      <div className="p-6 max-w-400">{children}</div>
    </>
  );
}
