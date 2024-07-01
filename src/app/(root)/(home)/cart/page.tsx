"use client";
import ProductCartCard from "@/components/product/ProductCartCard";
import { Button } from "@/components/ui/button";

import { CartContext } from "@/context/CartContext";
import { ProductProps, UserProps } from "@/types/index.d";
import Link from "next/link";
import React, { useContext } from "react";
import { LuShoppingCart } from "react-icons/lu";

import { useWishListUser } from "@/app/services/wishlist/queries";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

function CartPage() {
  const user = useSession();
  const { cartProducts } = useContext(CartContext);

  const searchParams = useSearchParams();
  const id: string | "" = searchParams.get("id") || "";
  const wishlistResult = useWishListUser(
    id ? id : (user?.data?.user as UserProps)?._id
  );

  const calcTotalPrice = (products: ProductProps[]) => {
    let total = 0;
    products?.forEach((product) => {
      total += parseFloat(product.price);
    });
    return total;
  };

  const totalPrice = calcTotalPrice(cartProducts);

  return (
    <div className="flex flex-col mt-24 sm:mt-0 text-dark400_light900">
      <h1 className="font-bold text-4xl pb-5">Carrinho de compras</h1>
      <div className="lg:flex gap-4 mt-5 justify-evenly">
        <div className="gap-10">
          <div>
            {!wishlistResult.isLoading && cartProducts?.length === 0 ? (
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
                  <LuShoppingCart className="w-4 h-4 leading-3" />
                  &nbsp;&nbsp;Ir as compras
                </Link>
              </div>
            ) : (
              <>
                {cartProducts?.map((prod: ProductProps, index: number) => (
                  <ProductCartCard
                    product={prod}
                    wishList={wishlistResult?.data?.wishlist?.products}
                    key={prod._id}
                    index={index as number}
                    isLoading={wishlistResult.isLoading}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        {cartProducts?.length === 0 ? (
          ""
        ) : (
          <div className="flex justify-center lg:justify-start">
            <div className="flex flex-col m-5 lg:m-0 items-start w-96 lg:w-72">
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
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
