"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { UserProps, SidebarLink } from "@/types/index.d";
import { MdDashboard } from "react-icons/md";

const LeftSidebar = () => {
  const { data: session, status } = useSession();
  const user = session?.user as UserProps;
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-[220px] flex-col bg-dark-100 border-r border-dark-400 pt-16 max-sm:hidden">
      <div className="flex flex-col flex-1 px-3 py-4">
        {status === "authenticated" && user && (
          <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-lg bg-dark-300">
            <div className="w-8 h-8 rounded-full bg-dark-500 flex items-center justify-center text-xs font-bold text-text-high">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-high truncate max-w-[120px]">
                {user.name}
              </span>
              <span className="text-xs text-text-muted">{user.role}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              pathname === "/dashboard"
                ? "bg-dark-400 text-accent border-l-2 border-accent"
                : "text-text-body hover:text-text-high hover:bg-dark-400"
            }`}
          >
            <MdDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          {sidebarLinks.flatMap((link: SidebarLink) =>
            link.menus?.map((menu) => {
              const isActive = pathname.includes(menu.href);
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-dark-400 text-accent border-l-2 border-accent"
                      : "text-text-body hover:text-text-high hover:bg-dark-400"
                  }`}
                >
                  {menu.icon}
                  {menu.title}
                </Link>
              );
            })
          )}

          <Link
            href="/dashboard/orders"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              pathname === "/dashboard/orders"
                ? "bg-dark-400 text-accent border-l-2 border-accent"
                : "text-text-body hover:text-text-high hover:bg-dark-400"
            }`}
          >
            <span className="w-4 h-4 flex items-center justify-center text-xs">$</span>
            Vendas
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LeftSidebar;
