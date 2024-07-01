import Link from "next/link";
import React from "react";
import { BsJoystick } from "react-icons/bs";
import Theme from "./Theme";

function AdminNav() {
  return (
    <nav className="flex justify-center bg-blue-900 py-3 pl-3 fixed w-full z-10">
      <div className="flex flex-row items-center gap-10 w-full">
        <Link className="flex items-center gap-1" href="/">
          <BsJoystick className="text-light-900 w-10 h-10 max-sm:hidden" />
          <p className="h2-bold text-3xl font-spaceGrotesk text-light-900 max-sm:hidden pl-1">
            Bit<span className="text-primary-500">World</span>
          </p>
        </Link>
      </div>
      <Theme />
    </nav>
  );
}

export default AdminNav;
