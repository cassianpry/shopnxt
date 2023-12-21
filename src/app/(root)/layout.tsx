"use client";
import Navbar from "@/src/components/navbar/NavBar";
import React from "react";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <Toaster />
      <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
        <div className="mx-auto w-full max-w-5x1">{children}</div>
      </section>
    </main>
  );
};

export default Layout;
