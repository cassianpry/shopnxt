"use client";
import Link from "next/link";
import React, { useContext } from "react";
import { BsJoystick } from "react-icons/bs";
import NavItems from "./NavItems";
import Theme from "./Theme";
import { useSession } from "next-auth/react";
import UserMenu from "./UserMenu";
import { Skeleton } from "../ui/skeleton";
import { CartContext } from "@/context/CartContext";
import { MdOutlineShoppingCart } from "react-icons/md";
import { UserProps } from "@/types/index.d";

interface UserMenuProps {
  user: UserProps;
  status: "authenticated" | "loading" | "unauthenticated";
}

const Navbar: React.FC<UserMenuProps> = ({ user, status }) => {
  //const { data, status } = useSession();
  const { cartProducts } = useContext(CartContext);

  return (
    <nav className="flex bg-blue-950 fixed z-50 w-full gap-5 p-2 dark:shadow-none sm:px-12 max-sm:gap-1 max-sm:p-1 max-sm:flex-col text-light-900 items-center">
      <div className="flex flex-row items-center gap-10 w-full">
        <Link className="flex gap-1" href="/">
          <BsJoystick className="w-8 h-8 max-sm:hidden" />
          <p className="h2-bold text-xl font-spaceGrotesk max-sm:hidden pl-1">
            Bit<span className="text-primary-500">World</span>
          </p>
        </Link>
        <NavItems />
      </div>

      <Theme />

      {user && user === undefined && status === "loading" ? (
        <span className="text-light-800 text-center">
          Faça&nbsp;
          <Link
            href="/sign-in"
            className="underline hover:text-blue-300 font-medium"
          >
            login
          </Link>
          &nbsp;ou&nbsp;
          <br />
          <Link
            href="/sign-in"
            className="underline hover:text-blue-300 font-medium"
          >
            cadastre-se
          </Link>
        </span>
      ) : status === "loading" ? (
        <Skeleton className="h-8 w-10 rounded-full bg-gray-500" />
      ) : user && user ? (
        <UserMenu user={user} />
      ) : (
        <span className="text-light-800 text-center">
          Faça&nbsp;
          <Link
            href="/sign-in"
            className="underline hover:text-blue-300 font-medium"
          >
            login
          </Link>
          &nbsp;ou&nbsp;
          <br />
          <Link
            href="/sign-up"
            className="underline hover:text-blue-300 font-medium"
          >
            cadastre-se
          </Link>
        </span>
      )}
      <Link
        href={{ pathname: "/cart", query: { id: user?._id } }}
        className="relative"
      >
        <MdOutlineShoppingCart className="w-8 h-8" />
        {cartProducts?.length > 0 && (
          <div className="absolute -top-2 -right-1 text-sm rounded-full py-0.5 px-1 leading-3 bg-blue-400">
            {cartProducts.length}
          </div>
        )}
      </Link>
    </nav>
  );
};

export default Navbar;
