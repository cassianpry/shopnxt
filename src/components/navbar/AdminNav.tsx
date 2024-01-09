import Image from "next/image";
import React from "react";

function AdminNav() {
  return (
    <nav className="flex justify-center bg-blue-900">
      <Image
        className="h-auto w-auto lg:block my-4"
        src="/assets/images/logo.png"
        width={130}
        height={130}
        alt="logo"
        priority
      />
    </nav>
  );
}

export default AdminNav;
