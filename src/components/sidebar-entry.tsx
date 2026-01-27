"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Boxes,
  Compass,
  File,
  Settings,
  Shirt,
  Smile,
  TableOfContents,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/dist/client/components/navigation";
import { ENTRIES } from "@/lib/constants";

export default function SidebarEntry({ entry }) {
  const pathname = usePathname().split("/").slice(-1);

  const isOverview = entry.id === ENTRIES.overview.id;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={
          pathname[0] === entry.id || ("/" + pathname[0] === ENTRIES.dashboard.id && isOverview)
        }
      >
        <Link href={"/" + (isOverview ? "" : entry.url)}>
          {entry.id === "overview" && <Compass />}
          {entry.id === "profile" && <Smile />}
          {entry.id === "closet" && <Shirt />}
          {entry.id === "account" && <UserRound />}
          {entry.id === "textures" && <Boxes />}
          {entry.id === "genconfig" && <File />}
          {entry.id === "content" && <TableOfContents />}
          {entry.id === "settings" && <Settings />}
          <span className="text-base">{entry.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
