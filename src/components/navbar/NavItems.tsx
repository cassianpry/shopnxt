"use client";
import { navItems } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const activeMap: Record<string, number> = {
  "/": 1,
  "/community": 2,
  "/about": 3,
};

const NavItems = () => {
  const pathname = usePathname();
  const active = activeMap[pathname] ?? null;

  return (
    <>
      {navItems.map((item) => (
        <Link key={item.id} href={item.href}>
          <p
            className={`${
              active === item.id ? "text-accent" : "text-text-body"
            } text-lg font-spaceGrotesk hover:text-accent pl-1 max-sm:text-lg transition-colors`}
          >
            {item.name}
          </p>
        </Link>
      ))}
    </>
  );
};

export default NavItems;
