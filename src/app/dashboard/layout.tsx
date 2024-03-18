"use client";
import Footer from "@/components/Footer";
import AdminNav from "@/components/navbar/AdminNav";
import LeftSidebar from "@/components/navbar/LeftSidebar";
import { Toaster } from "@/components/ui/toaster";
import { UserProps } from "@/types/index.d";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import React from "react";
import Loading from "./loading";
import { useRouter } from "next/navigation";

function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const { data, status } = useSession();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {data?.user !== undefined && status !== "loading" ? (
          <main className="relative">
            <AdminNav />

            <div className="container">
              <div className="flex">
                <div className="flex pt-16">
                  <LeftSidebar user={data?.user as UserProps} status={status} />
                </div>

                <section className="flex flex-1 flex-col px-6 pb-6 pt-6 max-md:pb-14 sm:px-14">
                  <div className="mx-auto w-full max-w-5x1">
                    {children}

                    <Toaster />
                  </div>
                </section>
              </div>
            </div>
          </main>
        ) : (
          <Loading />
        )}

        <Footer />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default Layout;
