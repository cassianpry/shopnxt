"use client";
import { useWishListUser } from "@/app/services/wishlist/queries";
import ProductCartCard from "@/components/product/ProductCartCard";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import React from "react";

function WishList() {
  const params = useParams();
  const wishlistResult = useWishListUser(params.id.toString());

  return (
    <div className="">
      <h1 className="h1-bold text-dark400_light900">Lista de desejos</h1>
      <Separator orientation="horizontal" className="bg-light-400" />
      {wishlistResult?.data?.wishlist?.products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="mt-10 text-3xl font-bold">
            Sua lista está vazia...
          </span>
        </div>
      ) : (
        <div className="mt-5">
          <ProductCartCard
            products={wishlistResult?.data?.wishlist?.products}
            wishList={wishlistResult?.data?.wishlist?.products}
            type="wishlist"
          />
        </div>
      )}
    </div>
  );
}

export default WishList;
