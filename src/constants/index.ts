import { SidebarLink } from "@/types/index.d";
import React from "react";
import { FaBox } from "react-icons/fa";
import { IoMdMoon } from "react-icons/io";
import {
  MdAccessTime,
  MdCategory,
  MdComputer,
  MdCreditCard,
  MdOutlineWbSunny,
  MdPersonAddAlt1,
  MdPhoneIphone,
} from "react-icons/md";

export const themes = [
  { value: "light", label: "Claro", icon: MdOutlineWbSunny },
  { value: "dark", label: "Escuro", icon: IoMdMoon },
  { value: "system", label: "Sistema", icon: MdComputer },
];

export const perks = [
  {
    title: "Disponível para celulares",
    icon: MdPhoneIphone,
    description:
      "Acesse de qualquer lugar com o seu dispositivo iOS ou Android.",
  },
  {
    title: "Acesso antecipado para jogos",
    icon: MdAccessTime,
    description:
      "Descubra, jogue e envolva-se com jogos durante a sua evolução. Seja o primeiro a ver o que está por vir e torne-se parte do processo.",
  },
  {
    title: "Compras mais fáceis",
    icon: MdCreditCard,
    description:
      "A nossa loja disponibiliza mais de 100 formas de pagamento em mais de 35 moedas, dando a você a flexibilidade de pagar como quiser.",
  },
];

export const navItems = [
  {
    id: 1,
    name: "Loja",
    href: "/",
  },
  // {
  //   id: 2,
  //   name: "Comunidade",
  //   href: "/community",
  // },
  {
    id: 3,
    name: "Sobre",
    href: "/about",
  },
];

export const userMenu = [
  {
    value: "profile",
    label: "Perfil",
  },
  { value: "wishlist", label: "Lista de desejos" },
  {
    value: "orders",
    label: "Minhas compras",
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
        href: "/dashboard/users",
        icon: React.createElement(MdPersonAddAlt1, {
          className: "w-5 h-5 mr-2",
        }),
      },
      {
        title: "Gêneros",
        href: "/dashboard/genres",
        icon: React.createElement(MdCategory, { className: "w-5 h-5 mr-2" }),
      },
      {
        title: "Produtos",
        href: "/dashboard/products",
        icon: React.createElement(FaBox, { className: "w-4 h-4 mr-2" }),
      },
    ],
  },
];
