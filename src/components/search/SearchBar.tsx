"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  route: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className, route }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [search, setSearch] = useState(query || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search && pathname === "/") {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: search,
        });
        router.push(`/browse${newUrl}`);
      }
      if (search && pathname !== "/") {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route && pathname !== "/") {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [search, pathname, route, router, searchParams, query]);

  return (
    <div
      className={`bg-slate-100 relative flex min-h-[56px] items-center gap-1 rounded-md px-4 border text-black ${className}`}
    >
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
        className="paragraph-regular no-focus placeholder border-none shadow-none outline-none bg-transparent"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (search && pathname === "/") {
              const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "query",
                value: search,
              });
              router.push(`/browse${newUrl}`);
            }
          }
        }}
      />
    </div>
  );
};

export default SearchBar;
