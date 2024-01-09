import React from "react";

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
  menus?: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[];
}
