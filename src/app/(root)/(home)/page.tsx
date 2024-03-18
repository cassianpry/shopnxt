"use client";
import React, { useEffect, useState } from "react";
import { useProducts } from "@/app/services/product/queries";
import { useWishListUser } from "@/app/services/wishlist/queries";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductProps, SearchParamsProps } from "@/types/index.d";
import SearchBar from "@/components/search/SearchBar";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ProductPriceCard } from "@/components/product/ProductPriceCard";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { useCreateWishList } from "@/app/services/wishlist/mutation";
import { useQueryClient } from "@tanstack/react-query";

interface userSessionProps {
  user?: {
    _id?: string | undefined | null;
    name?: string | undefined | null;
  };
}

function LandingPage({ searchParams }: SearchParamsProps) {
  const products = useProducts({ searchQuery: searchParams.query });
  const { data, status } = useSession();
  const [isWishListed, setIsWishListed] = useState<string[]>([]);

  const getUserId = (data: userSessionProps | null, status: string) => {
    const id = data?.user?._id;
    if (id && status === "authenticated") {
      return id;
    }
    return undefined;
  };
  const userId = getUserId(data, status);
  const wishlistProducts = useWishListUser(userId);

  const activeProducts = products?.data?.products?.filter(
    (product: ProductProps) => product.active === true
  );

  useEffect(() => {
    if (wishlistProducts?.data?.wishlist?.products) {
      const slugs = wishlistProducts.data.wishlist.products.map(
        (product: any) => product.slug!
      );
      setIsWishListed(slugs);
    }
  }, [wishlistProducts?.data?.wishlist?.products]);

  return (
    <>
      {products.isLoading ? (
        <div className="flex flex-col justify-start items-center space-y-3 w-full">
          <div className="mb-12 mt-11 flex flex-wrap gap-5 items-center space-x-4">
            <Skeleton className="h-14 w-14 rounded-full bg-gray-500" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px] bg-gray-500" />
              <Skeleton className="h-4 w-[200px] bg-gray-500" />
            </div>
          </div>
          <div className="flex flex-col gap-2 pb-5">
            <Skeleton className="h-4  w-[250px] bg-gray-500" />
            <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gray-500" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px] bg-gray-500" />
              <Skeleton className="h-4 w-[200px] bg-gray-500" />
            </div>
          </div>
          <div className="flex flex-col gap-2 pb-5">
            <Skeleton className="h-[250px] w-[125px] rounded-xl bg-gray-500" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[125px] bg-gray-500" />
              <Skeleton className="h-4 w-[110px] bg-gray-500" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-start items-center space-x-4 mb-10 text-dark300_light700">
            <SearchBar route="/browse" />
            <Link
              href="/"
              className="hover:dark:text-light-900 hover:text-light-400"
            >
              Descobrir
            </Link>
            <Link
              href="/browse"
              className="hover:dark:text-light-900 hover:text-light-400"
            >
              Navegar
            </Link>
          </div>
          {products.data?.products?.length > 0 && (
            <>
              <ProductCarousel
                products={activeProducts.slice(0, 5)}
                wishList={wishlistProducts?.data?.wishlist?.products}
                userId={userId}
                isLoading={products.isLoading}
                isWishListed={isWishListed}
                setIsWishListed={setIsWishListed}
              />
              <ProductPriceCard
                products={activeProducts}
                title="Jogos em destaque"
              />
              <ProductCard
                products={activeProducts}
                wishList={wishlistProducts?.data?.wishlist?.products}
                userId={userId}
                isLoading={wishlistProducts.isLoading}
                isWishListed={isWishListed}
                setIsWishListed={setIsWishListed}
              />
            </>
          )}
        </>
      )}
    </>
  );
}

export default LandingPage;
