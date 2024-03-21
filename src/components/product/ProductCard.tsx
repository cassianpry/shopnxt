"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import {
  IoMdAddCircleOutline,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { ProductProps } from "@/types/index.d";
import { useCreateWishList } from "@/app/services/wishlist/mutation";
import { Skeleton } from "../ui/skeleton";

interface ProductCardProps {
  userId?: string;
  wishList?: ProductProps[];
  products: ProductProps[];
  isLoading?: boolean;
  isWishListed: string[];
  setIsWishListed: React.Dispatch<React.SetStateAction<string[]>>;
}

function ProductCard({
  products,
  userId,
  isLoading,
  isWishListed,
  setIsWishListed,
}: ProductCardProps) {
  const query = useQueryClient();
  const addWishList = useCreateWishList();
  const [newProducts, setNewProducts] = useState<ProductProps[]>([]);

  const addToWishList = async (productId: string, slug: string) => {
    try {
      addWishList.mutate({ user: userId!, product: productId });
      setIsWishListed([...isWishListed, slug]);
      await query.invalidateQueries({ queryKey: ["wishlists"] });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    //Função para gerar um número aleatório
    const getRandomIndex = (length: number) => {
      return Math.floor(Math.random() * length);
    };

    // Gerar dois índices aleatórios
    const index1 = getRandomIndex(products.length);
    let index2 = getRandomIndex(products.length);

    // Garantir que os dois índices sejam diferentes
    while (index2 === index1) {
      index2 = getRandomIndex(products.length);
    }

    setNewProducts([products[index1], products[index2]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col gap-2 pb-5">
          <Skeleton className="h-4  w-[250px] bg-gray-500" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gray-500" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-gray-500" />
            <Skeleton className="h-4 w-[200px] bg-gray-500" />
          </div>
        </div>
      ) : (
        <div className="flex gap-10 max-w-[1100px] m-auto pt-5 relative text-dark400_light900 ">
          {newProducts.map((products) => (
            <div className="flex flex-grow" key={products._id}>
              <div className="flex flex-col justify-start">
                <Link href={`/products/${products.slug}`}>
                  <Image
                    className="rounded-2xl h-48 lg:h-80 mb-2 transition-all duration-300 ease-in-out hover:brightness-50"
                    src={products.productImage}
                    width={1000}
                    height={600}
                    alt=""
                    priority
                  />
                </Link>
                <p className="font-semibold">{products.name}</p>
                {products.price === "0" ? (
                  <div className="flex justify-between items-center">
                    <p>Gratuito</p>
                    <div className="flex justify-end gap-4">
                      <Button className="items-center justify-center font-semibold text-xs tracking-wide transition-all duration-300 ease-in-out border hover:bg-gray-300 dark:hover:bg-gray-500">
                        <span className="body-medium">Jogue de graça</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-start lg:flex-row lg:items-center justify-between gap-1">
                    <p>
                      {parseFloat(products.price).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                    <div className="flex justify-start gap-4 text-dark400_light900">
                      <Link href={`/products/${products.slug}`}>
                        <Button className="focus:shadow-outline items-center justify-center rounded-md font-semibold text-xs tracking-wide text-light-900  bg-blue-900 hover:bg-blue-600 transition-all duration-300 ease-in-out uppercase">
                          Compre já
                        </Button>
                      </Link>
                      {isWishListed.includes(products.slug!) ? (
                        <Link
                          href={{
                            pathname: `/profile/${userId}/wishlist`,
                            query: { id: userId },
                          }}
                        >
                          <Button className="items-center justify-center body-medium tracking-wide text-xs transition-all duration-300 ease-in-out hover:bg-gray-600">
                            <IoMdCheckmarkCircleOutline className="h-5 w-5" />
                            <span className="uppercase">
                              &nbsp;Na lista de desejos
                            </span>
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          className="items-center justify-center font-semibold text-xs tracking-wide transition-all duration-300 ease-in-out border hover:bg-gray-300 dark:hover:bg-gray-500"
                          onClick={() =>
                            addToWishList(products._id!, products.slug!)
                          }
                        >
                          <IoMdAddCircleOutline className="w-5 h-5" /> 
                          <span className="body-medium">Lista de desejos</span>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default ProductCard;
