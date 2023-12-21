"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import ThemeProvider from "../context/ThemeProvider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className={inter.className}>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
