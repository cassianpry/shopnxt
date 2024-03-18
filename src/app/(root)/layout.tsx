"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import CartProvider from "@/context/CartContext";
import { UserProps } from "@/types/index.d";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { ReactElement, ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  const { data, status } = useSession();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <main className="background-light800_dark300 flex flex-col min-h-screen">
          <div style={{ flex: 1 }}>
            <Navbar user={data?.user as UserProps} status={status} />
            <div className="container flex">
              {/* <div className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-20 max-md:pb-14 sm:px-14"> */}
              <div className="mx-auto w-full max-w-5x1">
                <div className="flex min-h-screen flex-1 flex-col px-6 pt-20 max-md:pb-14 sm:px-14">
                  {children}
                </div>
                <Toaster />
              </div>
            </div>
            <Footer />
          </div>
        </main>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default Layout;
