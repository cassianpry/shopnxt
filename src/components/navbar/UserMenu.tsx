"use client";

import * as React from "react";
import Link from "next/link";
//import Image from "next/image";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { FaUser } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaWallet } from "react-icons/fa";
import { RxExit } from "react-icons/rx";
import { RiHeartAddFill } from "react-icons/ri";
import { userMenu } from "@/constants";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  user: {
    _id?: string | undefined;
    name: string | undefined;
    email: string | undefined;
    avatar?: string | undefined;
    role?: string | undefined;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  return (
    <Menubar
      className="relative border-none
    bg-transparent shadow-none "
    >
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-blue-900 text-light-850 cursor-pointer">
          <span className="text-light900">Olá, {user.name}</span>
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-5rem] min-w-[120px] rounded border bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-300 w-[180px]">
          {user.role === "admin" && (
            <Link href="/dashboard">
              <MenubarItem className="flex cursor-pointer items-center gap-4 px-2.5 py-2 focus:bg-slate-200 dark:focus:bg-dark-400 rounded-md text-dark500_light700">
                <LuLayoutDashboard />
                Dashboard
              </MenubarItem>
            </Link>
          )}
          {userMenu.map((menu) => (
            <Link
              key={menu.value}
              href={
                menu.value === "profile"
                  ? `/profile/${user._id}`
                  : menu.value === "orders"
                  ? `/profile/${user._id}/orders`
                  : menu.value === "wishlist"
                  ? `/profile/${user._id}/wishlist`
                  : ""
              }
            >
              <MenubarItem className="flex cursor-pointer items-center gap-4 px-2.5 py-2 focus:bg-slate-200 dark:focus:bg-dark-400 rounded-md text-dark500_light700">
                {menu.value === "profile" && <FaUser />}
                {menu.value === "orders" && <FaWallet />}
                {menu.value === "wishlist" && <RiHeartAddFill />}
                {menu.label}
              </MenubarItem>
            </Link>
          ))}
          <MenubarSeparator />
          <hr />
          <MenubarItem
            className="flex items-center gap-4 px-2.5 py-2 focus:bg-slate-200 dark:focus:bg-dark-400 cursor-pointer rounded-md text-dark500_light700"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <RxExit /> Sair
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
