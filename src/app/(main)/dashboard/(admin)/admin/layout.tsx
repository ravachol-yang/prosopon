import { ReactNode } from "react";
import { PageHeader } from "@/components/page-header";

export default async function AdminSectionLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageHeader parent="admin" parentUrl="/admin/content" />
      {children}
    </>
  );
}
