"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import CartProvider from "@/context/CartContext";
import { UserProps, isUserProps } from "@/types/index.d";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  const { data, status } = useSession();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <main className="bg-dark-100 flex flex-col min-h-screen">
          <Navbar user={isUserProps(data?.user) ? data.user : null} status={status} />
          <div className="flex-1 pt-20">
            {children}
          </div>
          <Footer />
          <Toaster />
        </main>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default Layout;
