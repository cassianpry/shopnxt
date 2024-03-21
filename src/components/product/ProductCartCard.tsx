import { CartContext } from "@/context/CartContext";
import Image from "next/image";
import React, { useContext } from "react";
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
  products: ProductProps[];
  isLoading?: boolean;
  type?: string;
  wishList?: ProductProps[];
}

const ProductCartCard: React.FC<ProductCartCardProps> = ({
  products,
  wishList,
  isLoading,
  type,
}) => {
  const { addToCart, removeFromCart } = useContext(CartContext);
  const user = useSession();
  const addWishList = useCreateWishList();
  const deleteProductWishList = useDeleteProductWishList();

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

  return (
    <>
      {isLoading ? (
        <div className="mb-12 mt-11 flex flex-wrap gap-5 items-center space-x-4">
          <Skeleton className="h-14 w-14 rounded-full bg-gray-500" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-gray-500" />
            <Skeleton className="h-4 w-[200px] bg-gray-500" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 items-center">
          {products?.map((product, index) => {
            const isWishListed = wishList?.some(
              (wishListProduct) => wishListProduct.slug === product.slug
            );
            return (
              <div
                className="flex flex-col text-dark400_light900 bg-gray-200 dark:bg-gray-700 rounded-sm"
                key={product._id}
              >
                <div className="flex justify-center items-start m-5">
                  <Image
                    className="rounded-sm"
                    src={product.productImage}
                    alt={product.name}
                    width={150}
                    height={30}
                  />
                  <div className="flex flex-col ml-3">
                    <span className="font-semibold text-lg">
                      {product?.name}
                    </span>
                    <span className="font-normal text-sm">
                      {parseFloat(product?.price).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                    <span className="text-xs">{product.system}</span>
                    {/* {type === "wishlist" ? (
                      <div className="flex gap-3 mt-3">
                        <Button
                          className="w-full mb-1 items-center justify-center rounded-md font-semibold text-xs bg-blue-900 hover:bg-blue-600 transition-all duration-300 ease-in-out text-light-900"
                          onClick={() => addToCart(product)}
                        >
                          Adicionar ao carrinho
                        </Button>
                        <Button
                          className="flex justify-between items-center rounded-md text-xs transition-all duration-300 ease-in-out bg-red-900 hover:bg-red-600 text-light-900"
                          onClick={() => {
                            removeFromWishList(userId, product?._id!);
                          }}
                        >
                          <MdOutlineDeleteForever className="w-4 h-4 mr-1" />
                          Remover
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-5 flex justify-between gap-3">
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
                              onClick={() =>
                                addToWishList(userId, product?._id!)
                              }
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
                    )} */}
                  </div>
                </div>
                {type === "wishlist" ? (
                  <div className="flex gap-3 m-5">
                    <Button
                      className="w-full mb-1 items-center justify-center rounded-md font-semibold text-xs bg-blue-900 hover:bg-blue-600 transition-all duration-300 ease-in-out text-light-900"
                      onClick={() => addToCart(product)}
                    >
                      Adicionar ao carrinho
                    </Button>
                    <Button
                      className="flex justify-between items-center rounded-md text-xs transition-all duration-300 ease-in-out bg-red-900 hover:bg-red-600 text-light-900"
                      onClick={() => {
                        removeFromWishList(userId, product?._id!);
                      }}
                    >
                      <MdOutlineDeleteForever className="w-4 h-4 mr-1" />
                      Remover
                    </Button>
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
            );
          })}
        </div>
      )}
    </>
  );
};

export default ProductCartCard;
