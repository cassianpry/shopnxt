"use client";

import React from "react";
import Link from "next/link";

import { FaHome } from "react-icons/fa";
import { sidebarLinks } from "@/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { UserProps } from "@/types/index.d";
import { redirect } from "next/navigation";
import { Separator } from "../ui/separator";

interface UserMenuProps {
  user: UserProps;
  status: "authenticated" | "loading" | "unauthenticated";
}

const LeftSidebar: React.FC<UserMenuProps> = ({ user, status }) => {
  if (user && user === undefined && status === "loading") {
    redirect("/sign-in");
  }

  return (
    <section className="light-border sticky left-0 top-16 flex h-max flex-col justify-between overflow-y-auto border-r p-6 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px] custom-scrollbar text-dark300_light900">
      <span className="h3-semibold pb-5">Olá&nbsp;{user.name}</span>
      <div className="flex items-center gap-2 pb-10 hover:text-blue-600">
        <FaHome className="w-6 h-6" />
        <Link href="/dashboard">
          <h1 className="h1-bold">Dashboard</h1>
        </Link>
      </div>
      <div className="flex flex-1 flex-col">
        {sidebarLinks.map((item, i) => (
          <Accordion type="single" key={item.label} collapsible>
            <AccordionItem value={`item-${i}`} className="border-none">
              <AccordionTrigger className="hover:no-underline hover:text-blue-400">
                {item.label}
              </AccordionTrigger>
              {item.menus?.map((menu: any) => (
                <Link href={menu.href} key={menu.title}>
                  <AccordionContent className="flex pl-5 hover:text-blue-600 hover:underline ">
                    {menu.icon}
                    {menu.title}
                  </AccordionContent>
                </Link>
              ))}
            </AccordionItem>
          </Accordion>
        ))}
        <Separator orientation="horizontal" className="bg-slate-700" />
        <Link
          href="/dashboard/orders"
          className="mt-5 font-semibold hover:text-blue-400"
        >
          Vendas
        </Link>
      </div>
    </section>
  );
};

export default LeftSidebar;
