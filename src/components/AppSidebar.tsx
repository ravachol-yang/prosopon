import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import SidebarEntry from "@/components/sidebar-entry";

export function AppSidebar({ entries, user }) {
  const avatar = useMemo(() => {
    return createAvatar(lorelei, {
      seed: user.id,
      backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
    }).toDataUri();
  }, [user.id]);

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 my-1.5 px-1.5 text-left text-sm">
              <img src={avatar} className="rounded-full w-15" />
              <div className="grid flex-1 text-left leading-tight w-full">
                <span className="truncate font-medium text-base">
                  {user.name ?? user.email.split("@")[0]}
                </span>
                <span className="truncate text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {entries.map((section) => (
            <div key={section.title}>
              <Separator className="mb-3" />
              <SidebarGroupLabel className="text-sm mb-2 text-muted-foreground">
                {section.title}
              </SidebarGroupLabel>
              <SidebarGroupContent className="mb-3">
                <SidebarMenu>
                  {section.entries.map((entry) => (
                    <SidebarEntry key={entry.title} entry={entry} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem></SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
