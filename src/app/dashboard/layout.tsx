"use client";
import Footer from "@/components/Footer";
import AdminNav from "@/components/navbar/AdminNav";
import LeftSidebar from "@/components/navbar/LeftSidebar";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <main className="relative">
          <AdminNav />

          <div className="container">
            <div className="flex">
              <div className="flex pt-16">
                <LeftSidebar />
              </div>

              <section className="flex flex-1 flex-col px-6 pb-6 pt-6 max-md:pb-14 sm:px-14">
                <div className="mx-auto w-full max-w-[1400px]">
                  {children}

                  <Toaster />
                </div>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default Layout;
