// @ts-nocheck
import React from "react";
import { MdCategory, MdPersonAddAlt1 } from "react-icons/md";
import { SidebarLink } from "../types";

export const themes = [
  { value: "light", label: "Claro", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Escuro", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "Sistema", icon: "/assets/icons/computer.svg" },
];

export const userMenu = [
  {
    value: "profile",
    label: "Perfil",
    link: "/dashboard/user",
  },
  {
    value: "orders",
    label: "Minhas Compras",
    link: "/orders",
  },
];

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/assets/icons/wpforms.svg",
    route: "",
    label: "Cadastro",
    menus: [
      {
        title: "Usuários",
        href: "",
        icon: React.createElement(MdPersonAddAlt1, {
          className: "w-5 h-5 mr-2",
        }),
      },
      {
        title: "Categorias",
        href: "",
        icon: React.createElement(MdCategory, { className: "w-5 h-5 mr-2" }),
      },
    ],
  },
  {
    imgURL: "/assets/icons/wpforms.svg",
    route: "",
    label: "Teste",
  },
];
