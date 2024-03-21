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

  const userId: string = (user?.data?.user as UserProps)?._id!;
  const addToWishList = (user: string, product: string) => {
    try {
      addWishList.mutate({ user, product });
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromWishList = (user: string, product: string) => {
    try {
      deleteProductWishList.mutate({ user, product });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (type === "wishlist" && !isLoading) {
      const cartCheck = product.some(
        (cartProd: ProductProps) => cartProd.slug === wishList.slug
      );
      setCartListed(cartCheck);
    }
    if (!isLoading && type !== "wishlist") {
      const wishListCheck = wishList.some(
        (wishListProduct: ProductProps) =>
          wishListProduct.slug ===
          (Array.isArray(product) ? product[index].slug : product.slug)
      );
      setWishListed(wishListCheck);
    }
  }, [isLoading, product, type, wishList]);

  console.log("Carrinho=>", isCartListed);
  // console.log("Lista de Desejos=>", isWishListed);
  // console.log("Wishlist=>", wishList);
  // console.log("Cart=>", product);

  return (
    <>
      {isLoading ? (
        "Carregando"
      ) : (
        <div className="flex flex-col text-dark400_light900 rounded-md bg-gray-200 dark:bg-gray-700 m-5">
          <div className="flex items-start m-5 ">
            <Image
              className="rounded-sm"
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
              <span className="font-semibold text-lg">
                {type === "wishlist"
                  ? Array.isArray(wishList)
                    ? wishList[index].name
                    : wishList.name
                  : Array.isArray(product)
                  ? product[index].name
                  : product.name}
              </span>
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
          {type === "wishlist" ? (
            <div className="flex gap-3 m-5">
              {isCartListed ? (
                <Button
                  className="flex justify-between items-center rounded-md text-xs transition-all duration-300 ease-in-out bg-red-900 hover:bg-red-600 text-light-900"
                  onClick={() => {
                    removeFromWishList(userId, wishList?._id!);
                  }}
                >
                  <MdOutlineDeleteForever className="w-4 h-4 mr-1" />
                  Remover
                </Button>
              ) : (
                <Button
                  className="mb-1 items-center justify-center rounded-md font-semibold text-xs bg-blue-900 hover:bg-blue-600 transition-all duration-300 ease-in-out text-light-900"
                  onClick={() => addToCart(wishList)}
                >
                  Adicionar ao carrinho
                </Button>
              )}
            </div>
          ) : (
            <div className="mx-5 mb-5 flex justify-between gap-3">
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
