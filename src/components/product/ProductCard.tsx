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
      console.error(error);
    }
  };

  useEffect(() => {
    const getRandomIndex = (length: number) => {
      return Math.floor(Math.random() * length);
    };

    const index1 = getRandomIndex(products.length);
    let index2 = getRandomIndex(products.length);

    while (index2 === index1) {
      index2 = getRandomIndex(products.length);
    }

    setNewProducts([products[index1], products[index2]]);
  }, [products]);

  const formatPrice = (value: number | string) => {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const calculateDiscount = (oldPrice: number | string, price: number | string) => {
    const old = Number(oldPrice);
    const current = Number(price);
    if (old > current) {
      return Math.round(((old - current) / old) * 100);
    }
    return 0;
  };

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col gap-2 pb-5">
          <Skeleton className="h-4 w-[250px] bg-dark-500" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl bg-dark-500" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-dark-500" />
            <Skeleton className="h-4 w-[200px] bg-dark-500" />
          </div>
        </div>
      ) : (
        <div className="flex gap-10 max-w-[1100px] m-auto pt-5">
          {newProducts.map((product) => (
            <div className="flex-grow" key={product._id}>
              <div className="bg-dark-300 border border-dark-400 rounded-lg relative overflow-hidden transition-all duration-300 hover:border-accent/50 hover:translate-y-[-2px] hover:shadow-lg group">
                <Link href={`/products/${product.slug}`}>
                  <div className="relative">
                    <Image
                      className="w-full aspect-[16/9] object-cover rounded-t-lg transition-all duration-300 ease-in-out group-hover:brightness-50"
                      src={product.productImage}
                      width={1000}
                      height={562}
                      alt=""
                      priority
                    />
                    {product.oldPrice && product.price !== "0" && (
                      <div className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded">
                        -{calculateDiscount(product.oldPrice, product.price)}%
                      </div>
                    )}
                    <div className="absolute inset-0 bg-dark-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-md px-6 py-2 text-sm transition-colors duration-150">
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </Link>
                <div className="p-4 flex flex-col gap-1">
                  <p className="text-text-high font-medium text-sm truncate">
                    {product.name}
                  </p>
                  {product.price === "0" ? (
                    <div className="flex justify-between items-center">
                      <p className="text-text-high font-bold">Gratuito</p>
                          <Button className="bg-transparent text-text-body border border-dark-500 rounded-md px-4 py-2 text-sm hover:bg-dark-400 hover:text-text-high transition-colors duration-150">
                        Jogue de graça
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        {product.oldPrice && (
                          <p className="text-text-muted line-through text-xs">
                            {formatPrice(product.oldPrice)}
                          </p>
                        )}
                        <p className="text-text-high font-bold">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/products/${product.slug}`}>
                          <Button className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-md px-4 py-2 text-xs transition-colors duration-150 uppercase">
                            Compre já
                          </Button>
                        </Link>
                        {isWishListed.includes(product.slug!) ? (
                          <Link
                            href={{
                              pathname: `/profile/${userId}/wishlist`,
                              query: { id: userId },
                            }}
                          >
                            <Button className="bg-transparent text-text-body border border-dark-500 rounded-md px-3 py-2 text-xs hover:bg-dark-400 hover:text-text-high transition-colors duration-150">
                              <IoMdCheckmarkCircleOutline className="h-5 w-5" />
                              <span className="uppercase ml-1">
                                &nbsp;Na lista de desejos
                              </span>
                            </Button>
                          </Link>
                        ) : (
                            <Button
                          className="bg-transparent text-text-body border border-dark-500 rounded-md px-3 py-2 text-xs hover:bg-dark-400 hover:text-text-high transition-colors duration-150"
                          onClick={() =>
                            addToWishList(product._id!, product.slug!)
                          }
                        >
                          <IoMdAddCircleOutline className="w-5 h-5" />&nbsp;
                          Lista de desejos
                        </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default ProductCard;
