"use client";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import Link from "next/link";
import { BsJoystick } from "react-icons/bs";

export default function Layout({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex flex-col min-h-screen bg-dark-100">
        <header className="absolute top-0 left-0 w-full px-4 sm:px-6 py-4">
          <Link className="flex items-center gap-2 w-fit" href="/">
            <BsJoystick className="w-6 h-6 text-accent" />
            <p className="font-bold text-lg font-spaceGrotesk text-text-high">
              Bit<span className="text-accent">World</span>
            </p>
          </Link>
        </header>
        {children}
        <Toaster />
      </main>
    </QueryClientProvider>
  );
}
