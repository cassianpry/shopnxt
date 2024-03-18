"use client";
import ProductCartCard from "@/components/product/ProductCartCard";
import { Button } from "@/components/ui/button";

import { CartContext } from "@/context/CartContext";
import { ProductProps } from "@/types/index.d";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { LuShoppingCart } from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishListUser } from "@/app/services/wishlist/queries";
import { useSearchParams } from "next/navigation";

function CartPage() {
  const { cartProducts } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const id: string | "" = searchParams.get("id") || "";
  const wishlistProducts = useWishListUser(id);

  const calcTotalPrice = (products: ProductProps[]) => {
    let total = 0;
    products?.forEach((product) => {
      total += parseFloat(product.price);
    });
    return total;
  };

  const totalPrice = calcTotalPrice(cartProducts);

  useEffect(() => {
    setTimeout(() => {
      if (cartProducts) {
        setLoading(false);
      }
    }, 1000);
  }, [cartProducts]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col space-y-3 my-20">
          <Skeleton className="h-4  w-[250px] bg-gray-500" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gray-500" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-gray-500" />
            <Skeleton className="h-4 w-[200px] bg-gray-500" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col text-dark400_light900">
          <h1 className="font-bold text-4xl pb-5">Carrinho de compras</h1>
          <div className="flex gap-4 mt-5 justify-evenly">
            <div className="flex flex-col gap-10 max-w-[1000px]">
              <div className="flex">
                {cartProducts?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center">
                    <LuShoppingCart className="w-32 h-32 leading-3" />

                    <span className="mt-10 text-3xl font-bold">
                      Seu carrinho esta vazio...
                    </span>
                    <span className="mt-10 text-lg font-normal">
                      Antes de realizar o pagamento, adicione os jogos do seu
                      interesse
                    </span>
                    <Link
                      href="/"
                      className="focus:shadow-outline mt-16 p-3 flex items-center justify-center rounded-md font-semibold text-sm text-light-900  bg-blue-900 hover:bg-blue-600 transition-all duration-300 ease-in-out"
                    >
                      Ir as compras
                    </Link>
                  </div>
                ) : (
                  <ProductCartCard
                    products={cartProducts}
                    wishList={wishlistProducts?.data?.wishlist.products}
                  />
                )}
              </div>
            </div>
            {cartProducts?.length === 0 ? (
              ""
            ) : (
              <div className="flex flex-col items-start">
                <h3 className="font-bold text-xl mb-5">Resumo dos jogos</h3>
                <div className="w-full flex justify-between items center text-sm font-semibold">
                  <span>Total:&nbsp;</span>
                  <span>
                    {totalPrice.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <Button
                  asChild
                  className="mt-3 w-full flex items-center justify-center rounded-md font-semibold text-xs text-light-900  bg-blue-900 hover:bg-blue-600 transition-all duration-300 ease-in-out uppercase"
                >
                  <Link href="/cart/checkout">Finalizar a compra</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default CartPage;
