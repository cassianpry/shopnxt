"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import Image from "next/image";
import { sidebarLinks } from "@/src/constants";
import { FaHome } from "react-icons/fa";

const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <section className="background-light900_dark200 light-border sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-5 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px] custom-scrollbar text-dark300_light900">
      <div className="flex items-center gap-2 pb-10 text-dark300_light900">
        <FaHome className="w-6 h-6" />
        <h1 className="h1-bold">Dashboard</h1>
      </div>
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item, i) => (
          <Accordion type="single" collapsible>
            <AccordionItem value={`item-${i}`} className="border-none">
              <AccordionTrigger className="hover:no-underline hover:text-blue-400">
                {item.label}
              </AccordionTrigger>
              {item.menus?.map((menu: any) => (
                <AccordionContent className="flex items-center gap-1 pl-5 hover:text-blue-400 ">
                  {menu.icon}
                  {menu.title}
                </AccordionContent>
              ))}
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </section>
  );
};

export default LeftSidebar;
