import Link from "next/link";
import React from "react";
import { BiJoystick } from "react-icons/bi";
import Theme from "./Theme";
import SearchBar from "../search/SearchBar";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import UserMenu from "./user/UserMenu";

const Navbar = () => {
  const { data, status } = useSession();

  const user = data?.user as {
    name: string;
    username: string;
    role: string;
    email: string;
    avatar: string;

    icon: string;
  };

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
      </Link>
      <SearchBar />
      <div className="flex-between gap-5">
        {status === "loading" ? (
          <Skeleton className="h-10 w-10 rounded-full bg-blue-500" />
        ) : (
          <div className="flex justify-end items-center">
            <Theme />
            {status === "authenticated" ? (
              <UserMenu user={user} />
            ) : (
              <p className="text-light-900">
                <Link href="/sign-in">Login</Link>
              </p>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
