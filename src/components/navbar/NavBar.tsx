import Link from "next/link";
import React from "react";
import { BiJoystick } from "react-icons/bi";
import Theme from "./Theme";
import SearchBar from "../search/SearchBar";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

const Navbar = () => {
  const { data, status } = useSession();

  return (
    <nav className="flex-between bg-blue-900 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link className="flex items-center gap-1 text-light-850" href="/">
        <BiJoystick className="w-[70px] h-[70px] " />
        <Image
          className="h-auto w-auto hidden lg:block"
          src="/assets/images/logo.png"
          width={130}
          height={130}
          alt="logo"
          priority
        />
        {/* <p className="h2-bold font-spaceGrotesk dark:text-light-900 max-sm:hidden">
          Shop<span className="text-blue-300">NXT</span>
        </p>
       */}
      </Link>
      <SearchBar />
      <div className="flex-between gap-5">
        {status === "loading" ? (
          <Skeleton className="h-10 w-10 rounded-full bg-blue-500" />
        ) : (
          <>
            <Theme />
            {status === "authenticated" ? (
              <>
                <p className="text-light-900">{data.user?.name}</p>
                <p
                  className="cursor-pointer text-light-900"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Logout
                </p>
              </>
            ) : (
              <p className="text-light-900">
                <Link href="/sign-in">Login</Link>
              </p>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
