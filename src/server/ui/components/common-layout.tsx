"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LangSwitch } from "@/components/lang-switch";
import { AIAvatarCompact } from "@/components/ai-avatar";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={false} open={false}>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-[calc(100vh-1rem)] max-h-screen overflow-hidden">
        {/* Futuristic header */}
        <header className="relative flex h-14 shrink-0 items-center gap-2 border-b border-cyan-500/20 bg-gradient-to-r from-background via-background to-background">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          {/* Data stream animation */}
          <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
            <div
              className="h-full w-1/4 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{
                animation: "data-stream 4s linear infinite",
              }}
            />
          </div>

          <div className="flex-1 flex items-center gap-3 px-4">
            {/* Getting started link with avatar */}
            <Link
              href="/getting-started"
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              <AIAvatarCompact mood="happy" className="w-7 h-7" />
              <span className="font-tech text-sm text-cyan-400 group-hover:text-cyan-300 transition-colors">
                Getting Started
              </span>
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <div className="flex-1" />

            {/* Controls */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LangSwitch />
            </div>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-cyan-500/20" />
        </header>

        {/* Main content with grid background */}
        <div className="flex-1 overflow-auto relative">
          {/* Subtle grid background */}
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-500/20 pointer-events-none" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-500/20 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-500/20 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-500/20 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
