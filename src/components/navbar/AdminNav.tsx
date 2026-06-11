import Link from "next/link";
import React from "react";
import { BsJoystick } from "react-icons/bs";
import Theme from "./Theme";

function AdminNav() {
  return (
    <nav className="flex justify-center bg-dark-200 border-b border-dark-400 px-6 gap-5 items-center h-14 text-text-high fixed w-full z-10">
      <div className="flex flex-row items-center gap-10 w-full">
        <Link className="flex items-center gap-1" href="/">
          <BsJoystick className="text-text-high w-10 h-10 max-sm:hidden" />
          <p className="h2-bold text-3xl font-spaceGrotesk text-text-high max-sm:hidden pl-1">
            Bit<span className="text-accent">World</span>
          </p>
        </Link>
      </div>
      <Theme />
    </nav>
  );
}

export default AdminNav;
