"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/dist/client/components/navigation";
import { ENTRIES } from "@/lib/constants";

export function PageHeader() {
  const pathname = usePathname().split("/");

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          {
            <BreadcrumbList className="text-base">
              <BreadcrumbItem className="hidden md:block">
                {ENTRIES[pathname[1]] && (
                  <Link href={ENTRIES[pathname[1]].id}>{ENTRIES[pathname[1]].title}</Link>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {ENTRIES[pathname[2]] ? ENTRIES[pathname[2]].title : ENTRIES.overview.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          }
        </Breadcrumb>
      </div>
    </header>
  );
}
