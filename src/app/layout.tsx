"use client";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/context/ThemeProvider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <html lang="pt-BR">
        <body
          className={cn(
            "relative font-sans antialiased bg-dark-200 text-text-body",
            inter.variable,
            spaceGrotesk.variable
          )}
        >
          <SessionProvider>{children}</SessionProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}
