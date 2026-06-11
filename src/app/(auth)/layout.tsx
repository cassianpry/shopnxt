"use client";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex flex-col min-h-screen bg-dark-100">
        {children}
        <Toaster />
      </main>
    </QueryClientProvider>
  );
}
