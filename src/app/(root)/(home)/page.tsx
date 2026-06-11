"use client";
import React, { useEffect, useState, use } from "react";
import { useProducts } from "@/app/services/product/queries";
import { useWishListUser } from "@/app/services/wishlist/queries";
import { useSession } from "next-auth/react";
import { ProductProps, SearchParamsProps } from "@/types/index.d";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ProductPriceCard } from "@/components/product/ProductPriceCard";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
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
          <section className="min-h-[70vh] bg-dark-100 flex items-center">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-spaceGrotesk text-text-high">
                  Descubra o mundo dos jogos em{" "}
                  <span className="text-accent">BitWorld</span>
                </h1>
                <p className="text-text-body text-lg sm:text-xl max-w-xl mt-4">
                  Explore nossa coleção de jogos digitais e encontre seu
                  próximo título favorito.
                </p>
                <div className="flex flex-row gap-4 mt-8">
                  <Link
                    href="/browse"
                    className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-md px-6 py-3 text-sm transition-colors"
                  >
                    Explorar jogos
                  </Link>
                  <Link
                    href="/about"
                    className="border border-dark-500 text-text-body hover:text-text-high hover:bg-dark-400 rounded-md px-6 py-3 text-sm transition-colors"
                  >
                    Saiba mais
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {products.data?.products?.length > 0 && (
            <>
              <section className="bg-dark-200 py-12 sm:py-16">
                <ProductCarousel
                  products={activeProducts.slice(0, 5)}
                  wishList={wishlistProducts?.data?.wishlist?.products}
                  userId={userId}
                  isLoading={products.isLoading}
                  isWishListed={isWishListed}
                  setIsWishListed={setIsWishListed}
                />
              </section>
              <section className="bg-dark-100 py-12 sm:py-16">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-text-high text-2xl font-bold font-spaceGrotesk">
                      Jogos em Destaque
                    </h2>
                    <Link
                      href="/browse"
                      className="text-accent hover:text-accent-hover text-sm transition-colors"
                    >
                      Ver todos
                    </Link>
                  </div>
                  <ProductPriceCard products={activeProducts} title="" />
                </div>
              </section>
              <section className="bg-dark-200 py-12 sm:py-16">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                  <ProductCard
                    products={activeProducts}
                    wishList={wishlistProducts?.data?.wishlist?.products}
                    userId={userId}
                    isLoading={wishlistProducts.isLoading}
                    isWishListed={isWishListed}
                    setIsWishListed={setIsWishListed}
                  />
                </div>
              </section>
            </>
          )}
        </>
      )}
    </>
  );
}

export default LandingPage;
