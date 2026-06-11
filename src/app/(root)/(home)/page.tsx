"use client";
import React, { useEffect, useState, use } from "react";
import { useProducts } from "@/app/services/product/queries";
import { useWishListUser } from "@/app/services/wishlist/queries";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductProps, SearchParamsProps } from "@/types/index.d";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ProductPriceCard } from "@/components/product/ProductPriceCard";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import LoadingProductCarousel from "@/components/loadings/LoadingProductCarousel";
import LoadingHome from "@/components/loadings/LoadingHome";

interface userSessionProps {
  user?: {
    _id?: string | undefined | null;
    name?: string | undefined | null;
  };
}

function LandingPage(props: SearchParamsProps) {
  const searchParams = use(props.searchParams);
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
        <LoadingHome />
      ) : (
        <>
          <div className="flex justify-start items-center space-x-4 mb-10 text-dark300_light700">
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
