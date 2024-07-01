"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from "@/context/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import React, { ReactNode } from "react";
import { BsJoystick } from "react-icons/bs";

export default function Layout({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <main className="relative flex flex-col  background-light800_dark300">
        {/* <nav className="flex-between bg-blue-950 fixed z-50 w-full gap-5 p-6 dark:shadow-none sm:px-12">
        <div className="flex flex-row items-center gap-10 w-full">
          <Link className="flex items-center gap-1" href="/">
            <BsJoystick className="h-10 w-10 text-light-900" />
            <p className="h2-bold text-3xl font-spaceGrotesk text-light-900  pl-1">
              Bit<span className="text-primary-500">World</span>
            </p>
          </Link>
        </div>
      </nav> */}

        {children}
        <Toaster />
      </main>
    </QueryClientProvider>
  );
}
