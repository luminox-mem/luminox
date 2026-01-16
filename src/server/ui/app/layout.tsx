import type { Metadata } from "next";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import CommonLayout from "@/components/common-layout";
import { ParticlesBackground } from "@/components/particles-background";

export const metadata: Metadata = {
  title: "Luminox | AI Agent Context Platform",
  description: "Context Data Platform for Building Cloud-native AI Agents",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/ico_black.svg",
        href: "/ico_black.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/ico_white.svg",
        href: "/ico_white.svg",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased overflow-hidden">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Particle background */}
            <ParticlesBackground />

            {/* Main content */}
            <div className="relative z-10">
              <CommonLayout>
                {children}
                <Toaster />
              </CommonLayout>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
