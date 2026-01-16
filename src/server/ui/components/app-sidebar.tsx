"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";

import Image from "next/image";
import Link from "next/link";
import {
  Folder,
  Database,
  MessageSquare,
  LayoutDashboard,
  Activity,
  Rocket,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const { open } = useSidebar();
  const [isJaegerAvailable, setIsJaegerAvailable] = useState(false);

  // Check if Jaeger is available
  useEffect(() => {
    const checkJaeger = async () => {
      try {
        const { checkJaegerAvailability } = await import(
          "@/app/traces/actions"
        );
        const result = await checkJaegerAvailability();
        if (result.code === 0) {
          setIsJaegerAvailable(result.data?.available || false);
        }
      } catch (error) {
        console.error("Failed to check Jaeger availability:", error);
        setIsJaegerAvailable(false);
      }
    };

    checkJaeger();
    const interval = setInterval(checkJaeger, 30000);
    return () => clearInterval(interval);
  }, []);

  const gettingStartedItem = {
    title: "Get Started",
    url: "/getting-started",
    icon: Rocket,
    isSpecial: true,
  };

  const dashboardItem = {
    title: t("dashboard"),
    url: "/dashboard",
    icon: LayoutDashboard,
  };

  const otherNavItems = [
    {
      title: t("disk"),
      url: "/disk",
      icon: Folder,
    },
    {
      title: t("space"),
      url: "/space",
      icon: Database,
    },
    {
      title: t("session"),
      url: "/session",
      icon: MessageSquare,
    },
  ];

  // Add traces button after Dashboard if Jaeger is available
  const navItems = isJaegerAvailable
    ? [
        gettingStartedItem,
        dashboardItem,
        {
          title: t("traces"),
          url: "/traces",
          icon: Activity,
        },
        ...otherNavItems,
      ]
    : [gettingStartedItem, dashboardItem, ...otherNavItems];

  const data = {
    navMain: navItems as {
      title: string;
      url: string;
      icon?: React.ElementType;
      isSpecial?: boolean;
      items?: {
        title: string;
        url: string;
      }[];
    }[],
  };

  return (
    <Sidebar collapsible="icon" variant="inset" {...props} className="border-r border-cyan-500/20">
      <SidebarHeader className="relative">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-cyan-500/10 transition-all">
              <Link href="/" className="group">
                {open ? (
                  <div className="relative">
                    <Image
                      src="/rounded_white.svg"
                      alt="Luminox logo"
                      width={142}
                      height={32}
                      unoptimized
                      className="object-cover rounded-sm transition-all group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500/20 rounded blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Image
                      className="rounded relative z-10"
                      src="/ico_black.svg"
                      alt="Luminox logo"
                      width={32}
                      height={32}
                      priority
                    />
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavMain />
      </SidebarHeader>

      {/* Custom separator with glow */}
      <div className="relative mx-auto w-2/3 my-2">
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-sm" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  tooltip={{
                    children: item.title,
                    hidden: false,
                  }}
                  className={cn(
                    "relative transition-all duration-200",
                    "hover:bg-cyan-500/10",
                    pathname === item.url && "bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/10",
                    item.isSpecial && "bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/20 hover:border-cyan-500/40"
                  )}
                >
                  <Link href={item.url} className="font-tech font-medium tracking-wide">
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "transition-all",
                          pathname === item.url && "text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]",
                          item.isSpecial && "text-cyan-400"
                        )}
                      />
                    )}
                    <span className={cn(
                      pathname === item.url && "text-cyan-400",
                      item.isSpecial && "text-cyan-400"
                    )}>
                      {item.title}
                    </span>
                    {/* Active indicator */}
                    {pathname === item.url && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-cyan-400 rounded-l shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    )}
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.url}
                          className={cn(
                            "transition-all",
                            "hover:bg-cyan-500/10",
                            pathname === subItem.url && "text-cyan-400 bg-cyan-500/10"
                          )}
                        >
                          <Link href={subItem.url} className="font-tech">
                            {subItem.title}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom glow accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
    </Sidebar>
  );
}
