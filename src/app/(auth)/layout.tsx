import React from "react";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-blue-900 flex min-h-screen w-full items-center justify-center">
      <Toaster />
      {children}
    </main>
  );
};

export default Layout;
