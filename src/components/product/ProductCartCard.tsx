import { CartContext } from "@/context/CartContext";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { MdOutlineDeleteForever } from "react-icons/md";
import { ProductProps, UserProps } from "@/types/index.d";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import { createWishList } from "@/app/services/wishlist/api";
import {
  useCreateWishList,
  useDeleteProductWishList,
} from "@/app/services/wishlist/mutation";
import LoadingProductCard from "../loadings/LoadingProductCard";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { LuShoppingCart } from "react-icons/lu";

interface ProductCartCardProps {
  product: ProductProps | ProductProps[];
  isLoading?: boolean;
  type?: string;
  wishList: ProductProps;
  index?: number;
}

const ProductCartCard: React.FC<ProductCartCardProps> = ({
  product,
  wishList,
  isLoading,
  type,
  index = 0,
}) => {
  const { addToCart, removeFromCart } = useContext(CartContext);
  const user = useSession();
  const addWishList = useCreateWishList();
  const deleteProductWishList = useDeleteProductWishList();
  const [isWishListed, setWishListed] = useState<boolean | undefined>(false);
  const [isCartListed, setCartListed] = useState<boolean | undefined>(false);
  const queryClient = useQueryClient();

  const userId: string = (user?.data?.user as UserProps)?._id!;
  const addToWishList = async (user: string, product: string) => {
    try {
      addWishList.mutate({ user, product });
      await queryClient.invalidateQueries({
        queryKey: ["wishlists"],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromWishList = async (user: string, product: string) => {
    try {
      deleteProductWishList.mutate({ user, product });
      await queryClient.invalidateQueries({
        queryKey: ["wishlists"],
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (type === "wishlist" && !isLoading) {
      const cartCheck = product?.some(
        (cartProd: ProductProps) => cartProd.slug === wishList.slug
      );
      setCartListed(cartCheck);
    }
    if (!isLoading && type !== "wishlist") {
      const wishListCheck = wishList?.some(
        (wishListProduct: ProductProps) =>
          wishListProduct.slug ===
          (Array.isArray(product) ? product[index].slug : product.slug)
      );
      setWishListed(wishListCheck);
    }
  }, [index, isLoading, product, type, wishList]);

  return (
    <>
      {isLoading ? (
        <LoadingProductCard />
      ) : (
        <div className="flex flex-col text-dark400_light900 rounded-md bg-gray-200 dark:bg-gray-700 m-5">
          <div className="flex items-start ml-5 mt-5">
            <Image
              className="rounded-sm h-[86px] w-32 "
              src={
                type === "wishlist"
                  ? Array.isArray(wishList)
                    ? wishList[index].productImage
                    : wishList.productImage
                  : Array.isArray(product)
                  ? product[index].productImage
                  : product.productImage
              }
              alt={
                type === "wishlist"
                  ? Array.isArray(wishList)
                    ? wishList[index].name
                    : wishList.name
                  : Array.isArray(product)
                  ? product[index].name
                  : product.name
              }
              width={150}
              height={30}
            />
            <div className="flex flex-col ml-3">
              <Link
                className="text-blue-500 hover:text-blue-800 dark:hover:text-blue-300 -mt-2"
                href={`/products/${
                  type === "wishlist"
                    ? Array.isArray(wishList)
                      ? wishList[index].slug
                      : wishList.slug
                    : Array.isArray(product)
                    ? product[index].slug
                    : product.slug
                }`}
              >
                <span className="font-semibold text-lg">
                  {type === "wishlist"
                    ? Array.isArray(wishList)
                      ? wishList[index].name
                      : wishList.name
                    : Array.isArray(product)
                    ? product[index].name
                    : product.name}
                </span>
              </Link>
              <div className="flex flex-col mt-7">
                <span className="font-normal text-sm">
                  {parseFloat(
                    type === "wishlist"
                      ? Array.isArray(wishList)
                        ? wishList[index].price
                        : wishList.price
                      : Array.isArray(product)
                      ? product[index].price
                      : product.price
                  ).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
                <span className="text-xs">
                  {type === "wishlist"
                    ? Array.isArray(wishList)
                      ? wishList[index].system
                      : wishList.system
                    : Array.isArray(product)
                    ? product[index].system
                    : product.system}
                </span>
              </div>
            </div>
          </div>
          {type === "wishlist" ? (
            <div className="flex justify-between gap-3 m-5">
              {isCartListed ? (
                <Button
                  disabled={true}
                  className="mb-1 items-center justify-center rounded-md font-semibold text-xs bg-blue-900 hover:bg-blue-600 transition-all duration-300 ease-in-out text-light-900"
                >
                  <LuShoppingCart className="w-4 h-4 leading-3" />
                  &nbsp;&nbsp;No Carrinho
                </Button>
              ) : (
                <Button
                  className="mb-1 items-center justify-center rounded-md font-semibold text-xs bg-blue-900 hover:bg-blue-600 transition-all duration-300 ease-in-out text-light-900"
                  onClick={() => addToCart(wishList)}
                >
                  Adicionar ao carrinho
                </Button>
              )}
              <Button
                className="flex justify-between items-center rounded-md text-xs transition-all duration-300 ease-in-out bg-red-900 hover:bg-red-600 text-light-900"
                onClick={() => {
                  removeFromWishList(userId, wishList?._id!);
                }}
              >
                <MdOutlineDeleteForever className="w-4 h-4 mr-1" />
                Remover
              </Button>
            </div>
          ) : (
            <div className="m-5 flex justify-between ">
              {isWishListed ? (
                <>
                  <Button
                    className="flex text-dark400_light900 justify-between items-center rounded-md text-xs border transition-all duration-300 ease-in-out hover:border-red-600 border-gray-600"
                    onClick={() => removeFromCart(index)}
                  >
                    <MdOutlineDeleteForever className="w-4 h-4 mr-1" />
                    Remover
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="rounded-md font-semibold text-sm text-light-900  bg-blue-900 hover:bg-blue-600 transition-all duration-300 ease-in-out"
                    //@ts-ignore
                    onClick={() => addToWishList(userId, product?._id!)}
                  >
                    Adicionar à lista de desejos
                  </Button>
                  <Button
                    className="flex text-dark400_light900 justify-between items-center rounded-md text-xs border transition-all duration-300 ease-in-out hover:border-red-600 border-gray-600"
                    onClick={() => removeFromCart(index)}
                  >
                    <MdOutlineDeleteForever className="w-4 h-4 mr-1" />
                    Remover
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductCartCard;
