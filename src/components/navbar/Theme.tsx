"use client";

import React from "react";
import { useTheme } from "@/context/ThemeProvider";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { themes } from "@/constants";
import { IoMdMoon } from "react-icons/io";
import { MdOutlineWbSunny } from "react-icons/md";

const Theme = () => {
  const { mode, setMode } = useTheme();
  return (
    <Menubar
      className="relative border-none
    bg-transparent shadow-none"
    >
      <MenubarMenu>
        <MenubarTrigger className="">
          {mode === "light" ? (
            <MdOutlineWbSunny className="w-5 h-5 text-light-900 cursor-pointer" />
          ) : (
            <IoMdMoon className="h-5 w-5 text-light-900 cursor-pointer" />
          )}
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-3rem] mt-3 min-w-[120px] rounded border bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-300 text-dark-100">
          {themes.map((item) => (
            <MenubarItem
              key={item.value}
              className="flex items-center gap-4 px-2.5 py-2 focus:bg-slate-200 dark:focus:bg-dark-400 cursor-pointer rounded-md text-dar100_light900"
              onClick={() => {
                setMode(item.value);

                if (item.value !== "system") {
                  localStorage.theme = item.value;
                } else {
                  localStorage.removeItem("themes");
                }
              }}
            >
              <item.icon
                className={`${
                  mode === item.value ? "text-blue-600" : "dark:text-light-900"
                }`}
              />
              <p
                className={`body-semibold text-light-500 
              ${
                mode === item.value
                  ? "text-primary-500"
                  : "text-dark100_light900"
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
