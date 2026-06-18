"use client";
import ProductCartCard from "@/components/product/ProductCartCard";
import { Button } from "@/components/ui/button";

import { useCart } from "@/context/CartContext";
import { ProductProps, isUserProps } from "@/types/index.d";
import Link from "next/link";
import { LuShoppingCart } from "react-icons/lu";

import { useWishListUser } from "@/app/services/wishlist/queries";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

function CartPage() {
  const user = useSession();
  const { cartProducts } = useCart();

  const searchParams = useSearchParams();
  const id: string | "" = searchParams.get("id") || "";
  const userData = isUserProps(user?.data?.user) ? user.data.user : undefined;
  const wishlistResult = useWishListUser(
    id ? id : userData?._id
  );

  const calcTotalPrice = (products: ProductProps[]) => {
    let total = 0;
    products?.forEach((product) => {
      total += Number(product.price);
    });
    return total;
  };

  const totalPrice = calcTotalPrice(cartProducts);

  return (
    <div className="bg-dark-100 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 pb-16">
        <h1 className="text-text-high font-spaceGrotesk font-bold text-3xl mb-8">
          Carrinho de compras
        </h1>
        <div className="lg:flex gap-8">
          <div className="flex-1">
            {!wishlistResult.isLoading && cartProducts?.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <LuShoppingCart className="w-24 h-24 text-text-muted mb-6" />
                <span className="text-text-high text-2xl font-bold mb-3">
                  Seu carrinho esta vazio...
                </span>
                <span className="text-text-body text-base mb-8">
                  Antes de realizar o pagamento, adicione os jogos do seu
                  interesse
                </span>
                <Link
                  href="/"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <LuShoppingCart className="w-4 h-4" />
                  Ir as compras
                </Link>
              </div>
            ) : (
              <div className="bg-dark-300 rounded-xl p-6">
                {cartProducts?.map((prod: ProductProps, index: number) => (
                  <ProductCartCard
                    product={prod}
                    wishList={wishlistResult?.data?.wishlist?.products}
                    key={prod._id}
                    index={index}
                    isLoading={wishlistResult.isLoading}
                  />
                ))}
              </div>
            )}
          </div>
          {cartProducts?.length > 0 && (
            <div className="w-full lg:w-[380px] mt-8 lg:mt-0">
              <div className="bg-dark-300 rounded-xl p-6 sticky top-24">
                <h3 className="text-text-high text-lg font-bold font-spaceGrotesk mb-4">
                  Resumo dos jogos
                </h3>
                <div className="text-text-body text-sm flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="text-text-high">
                    {totalPrice.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <div className="text-text-body text-sm flex justify-between mb-4">
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
                <div className="border-t border-dark-500" />
                <div className="text-text-high text-xl font-bold flex justify-between mt-4">
                  <span>Total</span>
                  <span>
                    {totalPrice.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
                <Button
                  asChild
                  className="bg-accent hover:bg-accent-hover text-white font-bold w-full rounded-md py-3 text-sm transition-colors mt-6"
                >
                  <Link href="/cart/checkout">Finalizar a compra</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;
