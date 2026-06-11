"use client";
import React, { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { MdSearch } from "react-icons/md";

interface SearchBarProps {
  className?: string;
  route: string;
  isLoading?: boolean;
}

const SearchBarInner: React.FC<SearchBarProps> = ({ route }) => {
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
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar jogos..."
        value={search}
        onChange={handleChange}
        className="w-40 lg:w-56 bg-dark-400 border border-dark-500 rounded-full px-3 py-1.5 pl-9 text-sm text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
      />
      <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
    </div>
  );
};

const SearchBar: React.FC<SearchBarProps> = ({ className, route, isLoading }) => {
  if (isLoading) return null;

  return (
    <Suspense fallback={<div className="w-40 lg:w-56 bg-dark-400 rounded-full h-9 animate-pulse" />}>
      <SearchBarInner route={route} />
    </Suspense>
  );
};

export default SearchBar;
