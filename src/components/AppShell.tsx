import { Link, useLocation } from "react-router-dom";
import { Plug, Search, Users, Group } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const location = useLocation();
  const isSearch = location.pathname === "/";
  const isIntegrations = location.pathname.startsWith("/integrations");
  const isFriends = location.pathname.startsWith("/friends");
  const isCommunities = location.pathname.startsWith("/communities");

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader className="border-b border-sidebar-border/60">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
              K
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg leading-tight tracking-tight">Kue</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isSearch} tooltip="Search">
                    <Link to="/" className="flex items-center gap-2">
                      <Search className="shrink-0" />
                      <span>Search</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isFriends} tooltip="Friends">
                    <Link to="/friends" className="flex items-center gap-2">
                      <Users className="shrink-0" />
                      <span>Friends</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isCommunities} tooltip="Communities">
                    <Link to="/communities" className="flex items-center gap-2">
                      <Group className="shrink-0" />
                      <span>Communities</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isIntegrations} tooltip="Integrations">
                    <Link to="/integrations" className="flex items-center gap-2">
                      <Plug className="shrink-0" />
                      <span>Integrations</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border/60 text-xs text-sidebar-foreground/60">
          <div className="flex items-center justify-between px-2 py-2">
            <span>Prototype</span>
            <span className="text-[10px] uppercase tracking-wide">Mocked data</span>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <div className="flex min-h-svh flex-col bg-background">
          <div className="absolute top-4 left-4 z-10">
            <SidebarTrigger />
          </div>

          <main className="kue-container flex-1 py-8">{children}</main>

          <footer className="py-3 text-center">
            <p className="text-xs text-muted-foreground/40">Prototype · Using mocked data</p>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

