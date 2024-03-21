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
  const params = useParams();
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

  // const isWishListed = wishList?.data?.wishlist?.products.some(
  //   (wishListProduct: any) => wishListProduct?.slug === product?.data?.slug
  // );

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

  return (
    <>
      {product.isLoading ? (
        <div className="flex flex-col space-y-3 my-20">
          <Skeleton className="h-4  w-[250px] bg-gray-500" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gray-500" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-gray-500" />
            <Skeleton className="h-4 w-[200px] bg-gray-500" />
          </div>
        </div>
      ) : (
        <div className="flex gap-4 my-20 justify-evenly text-dark400_light900">
          <div className="flex gap-10 max-w-[1000px]">
            <div className="flex flex-col justify-start">
              <h1 className="font-bold text-4xl pb-5">{product.data.name}</h1>
              <Image
                className="rounded-2xl h-full w-[1200px]"
                src={product.data.productImage}
                width={1000}
                height={600}
                alt=""
              />
              <h2 className="font-normal text-lg mt-3">
                {product.data.description}
              </h2>
              <div className="flex flex-between items-center gap-2 mt-10">
                <div className="flex flex-col border-l-2 border-zinc-700">
                  <h3 className="font-semibold">&nbsp;Gêneros:</h3>
                  <p className="capitalize font-normal text-sm">
                    &nbsp;
                    {product.data.genres.map((genre: GenreProps) => (
                      <span key={genre._id}>{genre.name}&nbsp;</span>
                    ))}
                  </p>
                </div>
                <div className="flex flex-col border-l-2 border-zinc-700 mt-5">
                  <p>Todo: Multiplayer, Single Player, etc...</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 ">
                <ParseHTML data={product.data.about} />
              </div>
              <div className="mt-10 dark:bg-gray-800 bg-gray-200 p-5">
                <h3 className="font-semibold text-sm pb-5">
                  Requisitos mínimos
                </h3>
                <Separator orientation="horizontal" className="bg-gray-500" />
                <p className="text-xs pt-5 font-medium">
                  Sistema Operacional:&nbsp;
                  <span className="text-gray-400">{product.data.system}</span>
                </p>
                <p className="text-xs pt-5 font-medium">
                  Processador:&nbsp;
                  <span className="text-gray-400">
                    {product.data.processor}
                  </span>
                </p>
                <p className="text-xs pt-5 font-medium">
                  Memória:&nbsp;
                  <span className="text-gray-400">
                    {product.data.memory}&nbsp;GB
                  </span>
                </p>
                <p className="text-xs pt-5 font-medium">
                  Armazenamento:&nbsp;
                  <span className="text-gray-400">
                    {product.data.storage}&nbsp;GB de HD ou SSD
                  </span>
                </p>
                <p className="text-xs pt-5 font-medium">
                  Placa Gráfica:&nbsp;
                  <span className="text-gray-400">
                    {product.data.graphicCard}&nbsp;
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full max-w-64 items-start mt-52">
            <p className="font-medium">{product.data?.name}</p>
            <Badge className="font-medium py-1 bg-blue-900 text-light-900 mb-1">
              {parseFloat(product.data?.price).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Badge>
            {existingProduct ? (
              <Button
                asChild
                className="w-full border-[1px] mb-1 items-center justify-center rounded-md font-semibold text-xs  hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 ease-in-out uppercase"
              >
                <Link href={{ pathname: "/cart", query: { id: userId } }}>
                  Ir para o carrinho
                </Link>
              </Button>
            ) : (
              <Button
                className="w-full border-[1px] mb-1 items-center justify-center rounded-md font-semibold text-xs  hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 ease-in-out uppercase"
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
                <div className="flex border-[1px] mb-1 px-14 py-2.5 items-center justify-center rounded-md font-semibold text-xs text-nowrap  hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 ease-in-out uppercase">
                  <IoMdCheckmarkCircleOutline className="w-4 h-4" />
                  &nbsp;Na lista de desejos
                </div>
              </Link>
            ) : (
              <Button
                className="w-full border-[1px] mb-1 items-center justify-center rounded-md font-semibold text-xs  hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 ease-in-out uppercase"
                onClick={() => addToWishList(userId!, productId)}
              >
                <IoMdAddCircleOutline className="w-4 h-4" />
                &nbsp;Lista de desejos
              </Button>
            )}

            <Button
              asChild
              className="focus:shadow-outline mb-3 w-full flex items-center justify-center rounded-md font-semibold text-xs text-light-900  bg-blue-900 hover:bg-blue-600 transition-all duration-300 ease-in-out uppercase"
              onClick={() => (existingProduct ? {} : addToCart(product.data))}
            >
              <Link href="/cart">Compre já</Link>
            </Button>
            <div className="flex w-full justify-between text-xs mb-2">
              <p>Desenvolvedora</p>
              <p className="text-gray-500">{product.data?.developer}</p>
            </div>
            <Separator orientation="horizontal" className="bg-gray-500" />
            <div className="flex w-full justify-between text-xs my-2">
              <p>Editora</p>
              <p className="text-gray-500">{product.data?.publisher}</p>
            </div>
            <Separator orientation="horizontal" className="bg-gray-500" />
            <div className="flex w-full justify-between text-xs my-2">
              <p>Plataforma</p>
              <p className="text-gray-500">{product.data?.system}</p>
            </div>
            <Separator orientation="horizontal" className="bg-gray-500" />
            <div className="flex w-full justify-between text-xs my-2">
              <p>Data de lançamento</p>
              <p className="text-gray-500">
                {moment(product.data?.createdAt).locale("pt-br").format("L")}
              </p>
            </div>
            <Separator orientation="horizontal" className="bg-gray-500" />
          </div>
        </div>
      )}
    </>
  );
}

export default ProductPage;
