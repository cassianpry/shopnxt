"use client";
import { useWishListUser } from "@/app/services/wishlist/queries";
import LoadingProductCard from "@/components/loadings/LoadingProductCard";
import ProductCartCard from "@/components/product/ProductCartCard";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CartContext } from "@/context/CartContext";
import { ProductProps } from "@/types/index.d";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

function WishList() {
  const params = useParams();
  const wishlistResult = useWishListUser(params.id.toString());
  const [loading, setLoading] = useState(true);
  const { cartProducts } = useContext(CartContext);

  return (
    <>
      {wishlistResult.isLoading ? (
        <div className="flex flex-col mt-10 gap-5">
          <LoadingProductCard />
          <LoadingProductCard />
        </div>
      ) : (
        <div className="">
          <h1 className="h1-bold text-dark400_light900">Lista de desejos</h1>
          <Separator orientation="horizontal" className="bg-light-400" />
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
                    index={index as number}
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
