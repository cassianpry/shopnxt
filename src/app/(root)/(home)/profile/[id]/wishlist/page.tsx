"use client";
import { useWishListUser } from "@/app/services/wishlist/queries";
import LoadingProductCard from "@/components/loadings/LoadingProductCard";
import ProductCartCard from "@/components/product/ProductCartCard";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { ProductProps } from "@/types/index.d";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

function WishList() {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return redirect("/sign-in");
  }

  const params = useParams<{ id: string }>();
  const wishlistResult = useWishListUser(params.id.toString());
  const { cartProducts } = useCart();

  return (
    <>
      {wishlistResult.isLoading ? (
        <div className="flex flex-col mt-10 gap-5">
          <LoadingProductCard />
          <LoadingProductCard />
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 pb-16">
          <h1 className="text-4xl font-bold text-text-high font-spaceGrotesk mb-8">Lista de desejos</h1>
          <Separator orientation="horizontal" className="bg-dark-400" />
          {wishlistResult?.data?.wishlist?.products.length === 0 ||
          wishlistResult?.data?.wishlist?.products.length === undefined ? (
            <div className="flex flex-col items-center justify-center text-center">
              <span className="mt-10 text-3xl font-bold">
                Sua lista está vazia...
              </span>
            </div>
          ) : (
            <>
              {wishlistResult?.data?.wishlist?.products?.map(
                (wishProd: ProductProps, index: number) => (
                  <ProductCartCard
                    product={cartProducts}
                    wishList={wishProd}
                    type="wishlist"
                    key={wishProd._id}
                    index={index}
                  />
                )
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

export default WishList;
