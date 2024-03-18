"use client";
import { navItems } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const NavItems = () => {
  const [active, setActive] = useState<number | null>(null);
  const pathname = usePathname();

  if (active === null) {
    if (pathname === "/") {
      setActive(1);
    } else if (pathname === "/community") {
      setActive(2);
    } else if (pathname === "/about") {
      setActive(3);
    }
  }
  return (
    <>
      {navItems.map((item) => {
        const handleClick = (id: React.SetStateAction<number | null>) => {
          setActive(id);
        };

        return (
          <Link key={item.id} href={item.href}>
            <p
              className={`${
                active === item.id ? "active" : "text-light-900"
              } h2-bold text-lg font-spaceGrotesk hover:text-blue-600 pl-1 max-sm:text-lg`}
              onClick={() => handleClick(item.id)}
            >
              {item.name}
            </p>
          </Link>
        );
      })}
    </>
  );
};

export default NavItems;
