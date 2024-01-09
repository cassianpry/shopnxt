"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/src/components/ui/menubar";

import { FaUser } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaWallet } from "react-icons/fa";
import { RxExit } from "react-icons/rx";
import { userMenu } from "@/src/constants";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  user: {
    name: string;
    username: string;
    email: string;
    avatar?: string;
    role: string;
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
          <Image src={user.avatar!} alt="avatar" width={50} height={50} />
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-3rem] mt-3 min-w-[120px] rounded border bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-300 w-[180px]">
          {user.role === "admin" && (
            <Link href="/dashboard/admin">
              <MenubarItem className="flex cursor-pointer items-center gap-4 px-2.5 py-2 focus:bg-slate-200 dark:focus:bg-dark-400 rounded-md text-dark500_light700">
                <LuLayoutDashboard />
                Dashboard
              </MenubarItem>
            </Link>
          )}
          {userMenu.map((menu) => (
            <Link href={menu.link}>
              <MenubarItem
                key={menu.value}
                className="flex cursor-pointer items-center gap-4 px-2.5 py-2 focus:bg-slate-200 dark:focus:bg-dark-400 rounded-md text-dark500_light700"
              >
                {menu.value === "profile" && <FaUser />}
                {menu.value === "orders" && <FaWallet />}

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
