"use client";
import Link from "next/link";
import React, { useContext } from "react";
import { BsJoystick } from "react-icons/bs";
import NavItems from "./NavItems";
import Theme from "./Theme";
import UserMenu from "./UserMenu";
import { Skeleton } from "../ui/skeleton";
import { CartContext } from "@/context/CartContext";
import { MdOutlineShoppingCart } from "react-icons/md";
import { UserProps } from "@/types/index.d";
import SearchBar from "../search/SearchBar";

interface NavbarProps {
  user: UserProps;
  status: "authenticated" | "loading" | "unauthenticated";
}

const Navbar: React.FC<NavbarProps> = ({ user, status }) => {
  const { cartProducts } = useContext(CartContext);

  return (
    <nav className="bg-dark-200 fixed z-50 w-full border-b border-dark-400">
      <div className="max-w-[1400px] mx-auto h-14 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link className="flex items-center gap-2" href="/">
            <BsJoystick className="w-6 h-6 text-accent" />
            <p className="font-bold text-lg font-spaceGrotesk text-text-high">
              Bit<span className="text-accent">World</span>
            </p>
          </Link>
          <NavItems />
        </div>

        <div className="flex items-center gap-4">
          <SearchBar route="/browse" isLoading={false} />
          <Theme />

          {status === "loading" ? (
            <Skeleton className="h-8 w-10 rounded-full bg-dark-500" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <div className="flex items-center gap-3 text-sm text-text-body">
              <Link href="/sign-in" className="hover:text-text-high transition-colors">
                Entrar
              </Link>
              <Link
                href="/sign-up"
                className="bg-accent text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-accent-hover transition-colors"
              >
                Cadastrar
              </Link>
            </div>
          )}

          <Link
            href={{ pathname: "/cart", query: { id: user?._id } }}
            className="relative"
          >
            <MdOutlineShoppingCart className="w-6 h-6 text-text-body hover:text-text-high transition-colors" />
            {cartProducts?.length > 0 && (
              <div className="absolute -top-2 -right-2 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center bg-accent text-white">
                {cartProducts.length}
              </div>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
