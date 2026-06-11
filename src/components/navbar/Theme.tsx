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
            <MdOutlineWbSunny className="w-5 h-5 text-text-body cursor-pointer" />
          ) : (
            <IoMdMoon className="h-5 w-5 text-text-body cursor-pointer" />
          )}
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-3rem] mt-3 min-w-[120px] rounded border bg-dark-300 py-2 dark:border-dark-400 dark:bg-dark-300 text-text-high">
          {themes.map((item) => (
            <MenubarItem
              key={item.value}
              className="flex items-center gap-4 px-2.5 py-2 focus:bg-dark-400 dark:focus:bg-dark-400 cursor-pointer rounded-md text-text-high"
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
                  mode === item.value ? "text-accent" : "dark:text-text-body"
                }`}
              />
              <p
                className={`body-semibold text-text-muted 
              ${
                mode === item.value
                  ? "text-accent"
                  : "text-text-high"
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
