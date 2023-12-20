import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiJoystick } from "react-icons/bi";
import Theme from "./Theme";

const Navbar = () => {
  return (
    <nav className="flex-between bg-blue-900 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link className="flex items-center gap-1 text-light-850" href="/">
        <BiJoystick className="w-[35px] h-[35px] " />
        <p className="h2-bold font-spaceGrotesk dark:text-light-900 max-sm:hidden">
          Shop<span className="text-blue-300">NXT</span>
        </p>
      </Link>
      SEARCH
      <div className="flex-between gap-5">
        <Theme />
      </div>
    </nav>
  );
};

export default Navbar;
