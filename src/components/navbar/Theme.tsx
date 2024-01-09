"use client";

import React from "react";
import { useTheme } from "@/src/context/ThemeProvider";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/src/components/ui/menubar";
import Image from "next/image";
import { themes } from "@/src/constants";
import { FiMoon, FiSun } from "react-icons/fi";

const Theme = () => {
  const { mode, setMode } = useTheme();
  return (
    <Menubar
      className="relative border-none
    bg-transparent shadow-none "
    >
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-blue-900">
          {mode === "light" ? (
            <FiSun className="w-[20px] h-[20px] text-light-850 cursor-pointer" />
          ) : (
            <FiMoon className="w-[20px] h-[20px] text-light-850 cursor-pointer" />
          )}
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-3rem] mt-3 min-w-[120px] rounded border bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-300">
          {themes.map((item) => (
            <MenubarItem
              key={item.value}
              className="flex items-center gap-4 px-2.5 py-2 focus:bg-slate-200 dark:focus:bg-dark-400 cursor-pointer rounded-md"
              onClick={() => {
                setMode(item.value);

                if (item.value !== "system") {
                  localStorage.theme = item.value;
                } else {
                  localStorage.removeItem("themes");
                }
              }}
            >
              <Image
                src={item.icon}
                alt={item.value}
                width={16}
                height={16}
                className={`${mode === item.value && "active-theme"}`}
              />
              <p
                className={`body-semibold text-blue-500 
              ${
                mode === item.value ? "text-blue-500" : "text-dark100_light900"
              }`}
              >
                {item.label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Theme;
