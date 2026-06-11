"use client";
import { useProductBySlug } from "@/app/services/product/queries";
import ParseHTML from "@/components/product/ParseHTML";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GenreProps, UserProps } from "@/types/index.d";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
// @ts-expect-error -- moment locale has no type declarations
import "moment/locale/pt-br";
import { Skeleton } from "@/components/ui/skeleton";
import { CartContext } from "@/context/CartContext";
import Link from "next/link";
import {
  IoMdAddCircleOutline,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { useSession } from "next-auth/react";
import { useCreateWishList } from "@/app/services/wishlist/mutation";
import { useWishListUser } from "@/app/services/wishlist/queries";
import { useQueryClient } from "@tanstack/react-query";

function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = useProductBySlug(params.slug.toString());
  const { addToCart, cartProducts } = useContext(CartContext);
  const user = useSession();
  const query = useQueryClient();
  const [isWishListed, setIsWishListed] = useState(false);

  const existingProduct = cartProducts?.find(
    (item) => item._id === product?.data?._id
  );

  const userId = (user?.data?.user as UserProps)?._id;
  const productId = product?.data?._id;

  const wishList = useWishListUser(userId);

  const addWishList = useCreateWishList();

  const addToWishList = async (user: string, product: string) => {
    try {
      addWishList.mutate({ user, product });
      setIsWishListed(true);
      await query.invalidateQueries({ queryKey: ["wishlists"] });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (wishList?.data?.wishlist?.products && product?.data) {
      setIsWishListed(
        wishList?.data?.wishlist?.products.some(
          (wishListProduct: any) => wishListProduct.slug === product.data.slug
        )
      );
    }
  }, [wishList.data?.wishlist?.products, product.data]);

  const formatPrice = (value: string) =>
    parseFloat(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <>
      {product.isLoading ? (
        <div className="flex flex-col space-y-3 my-20">
          <Skeleton className="h-4 w-[250px] bg-dark-500" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl bg-dark-500" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-dark-500" />
            <Skeleton className="h-4 w-[200px] bg-dark-500" />
          </div>
        </div>
      ) : (
        <div className="bg-dark-100 min-h-screen">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 pb-16">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-[70%]">
                <Image
                  className="rounded-xl aspect-video object-cover w-full"
                  src={product.data.productImage}
                  width={1000}
                  height={562}
                  alt=""
                />
              </div>
              <div className="w-full lg:w-[30%]">
                <div className="bg-dark-300 rounded-xl p-6 sticky top-24">
                  <h1 className="text-text-high text-3xl font-bold font-spaceGrotesk mb-4">
                    {product.data.name}
                  </h1>
                  <Badge className="font-medium py-1 bg-accent text-white mb-4">
                    {formatPrice(product.data?.price)}
                  </Badge>
                  <Button
                    asChild
                    className="bg-accent hover:bg-accent-hover text-white font-bold rounded-md px-8 py-3 w-full text-sm transition-colors mb-3"
                    onClick={() => (existingProduct ? {} : addToCart(product.data))}
                  >
                    <Link href="/cart">Compre já</Link>
                  </Button>
                  {existingProduct ? (
                    <Button
                      asChild
                      className="w-full border border-dark-400 mb-2 items-center justify-center rounded-md font-semibold text-xs hover:bg-dark-400 transition-all duration-300 ease-in-out uppercase text-text-high"
                    >
                      <Link href={{ pathname: "/cart", query: { id: userId } }}>
                        Ir para o carrinho
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      className="w-full border border-dark-400 mb-2 items-center justify-center rounded-md font-semibold text-xs hover:bg-dark-400 transition-all duration-300 ease-in-out uppercase text-text-high"
                      onClick={() => addToCart(product.data)}
                    >
                      Adicionar ao carrinho
                    </Button>
                  )}
                  {isWishListed ? (
                    <Link
                      href={{
                        pathname: `/profile/${userId}/wishlist`,
                        query: { id: userId },
                      }}
                    >
                      <div className="flex border border-dark-400 mb-2 px-14 py-2.5 items-center justify-center rounded-md font-semibold text-xs text-nowrap hover:bg-dark-400 transition-all duration-300 ease-in-out uppercase text-text-high">
                        <IoMdCheckmarkCircleOutline className="w-4 h-4" />
                        &nbsp;Na lista de desejos
                      </div>
                    </Link>
                  ) : (
                    <Button
                      className="w-full border border-dark-400 mb-2 items-center justify-center rounded-md font-semibold text-xs hover:bg-dark-400 transition-all duration-300 ease-in-out uppercase text-text-high"
                      onClick={() => addToWishList(userId!, productId)}
                    >
                      <IoMdAddCircleOutline className="w-4 h-4" />
                      &nbsp;Lista de desejos
                    </Button>
                  )}
                  <Separator className="bg-dark-400 my-3" />
                  <div className="flex w-full justify-between text-xs mb-2">
                    <p className="text-text-muted">Desenvolvedora</p>
                    <p className="text-text-high">{product.data?.developer}</p>
                  </div>
                  <Separator className="bg-dark-400" />
                  <div className="flex w-full justify-between text-xs my-2">
                    <p className="text-text-muted">Editora</p>
                    <p className="text-text-high">{product.data?.publisher}</p>
                  </div>
                  <Separator className="bg-dark-400" />
                  <div className="flex w-full justify-between text-xs my-2">
                    <p className="text-text-muted">Plataforma</p>
                    <p className="text-text-high">{product.data?.system}</p>
                  </div>
                  <Separator className="bg-dark-400" />
                  <div className="flex w-full justify-between text-xs my-2">
                    <p className="text-text-muted">Data de lançamento</p>
                    <p className="text-text-high">
                      {moment(product.data?.createdAt).locale("pt-br").format("L")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-dark-300 rounded-xl p-6 mt-8">
              <h2 className="text-text-high text-xl font-bold font-spaceGrotesk mb-4">
                Sobre o jogo
              </h2>
              <p className="text-text-body leading-relaxed mb-4">
                {product.data.description}
              </p>
              <ParseHTML data={product.data.about} />
            </div>
            <div className="bg-dark-300 rounded-xl p-6 mt-6">
              <h3 className="text-text-high text-lg font-bold font-spaceGrotesk mb-4">
                Requisitos mínimos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-text-muted text-sm">Sistema Operacional</p>
                  <p className="text-text-high text-sm">{product.data.system}</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Processador</p>
                  <p className="text-text-high text-sm">{product.data.processor}</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Memória</p>
                  <p className="text-text-high text-sm">{product.data.memory} GB</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Armazenamento</p>
                  <p className="text-text-high text-sm">{product.data.storage} GB de HD ou SSD</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Placa Gráfica</p>
                  <p className="text-text-high text-sm">{product.data.graphicCard}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {product.data.genres.map((genre: GenreProps) => (
                <span
                  key={genre._id}
                  className="bg-dark-400 text-text-body text-xs rounded-full px-3 py-1"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductPage;
