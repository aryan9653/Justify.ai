import { ThemeProvider } from "@/components/theme-provider";
import { TranslationProvider } from "@/hooks/use-translation";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Access to Justice - AI Legal Assistant",
  description: "AI-powered legal guidance for everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationProvider>
            {children}
            <Toaster richColors />
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
