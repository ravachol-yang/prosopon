import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function AppSidebar({ entries }: { entries }) {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 py-1.5 px-0.5 text-left text-sm">
              <Avatar className="h-11 w-11 rounded-lg">
                <AvatarImage src="" alt="user" />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium text-base">Rhizome</span>
                <span className="truncate text-muted-foreground">bob@example.com</span>
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
                    <SidebarMenuItem key={entry.title}>
                      <SidebarMenuButton asChild>
                        <Link href={"/dashboard/" + entry.url}>
                          <entry.icon strokeWidth={2} />
                          <span className="text-base">{entry.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
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
