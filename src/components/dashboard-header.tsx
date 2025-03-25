"use client";

import { LanguageSelector } from "@/components/language-selector";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Scale } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function DashboardHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Access to Justice</h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/cases"
              className="text-sm font-medium hover:text-primary"
            >
              My Cases
            </Link>
            <Link
              href="/dashboard/resources"
              className="text-sm font-medium hover:text-primary"
            >
              Resources
            </Link>
          </nav>
          <LanguageSelector />
          <ModeToggle />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <LanguageSelector />
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/cases"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  My Cases
                </Link>
                <Link
                  href="/dashboard/resources"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Resources
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
