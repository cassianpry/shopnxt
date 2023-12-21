"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Input } from "../ui/input";

const SearchBar = () => {
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="background-light800_darkgradient relative flex min-h-[56px] w-1/2 items-center gap-1 rounded-xl px-4">
      <Image
        src="/assets/icons/search.svg"
        alt="pesquisar"
        width={24}
        height={24}
      />
      <Input
        type="text"
        placeholder="Pesquise..."
        value={search}
        onChange={handleChange}
        className="paragraph-regular no-focus placeholder border-none shadow-none outline-none text-dark400_light700 bg-transparent"
      />
    </div>
  );
};

export default SearchBar;
