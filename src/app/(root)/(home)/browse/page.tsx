"use client";
import { useProducts } from "@/app/services/product/queries";
import SearchBar from "@/components/search/SearchBar";
import { ProductProps, SearchParamsProps } from "@/types/index.d";
import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";

function Browse(props: SearchParamsProps) {
  const searchParams = use(props.searchParams);
  const products = useProducts({ searchQuery: searchParams.query });

  return (
    <div className="container text-dark400_light900">
      <div className="flex justify-start items-center space-x-4 mb-10">
        <SearchBar route="/browse" />
        <Link href="/" className="hover:text-light-500">
          Descobrir
        </Link>
        <Link href="/browse" className="hover:text-light-900">
          Navegar
        </Link>
      </div>
      <div className="container flex flex-wrap gap-[16px]">
        {products?.data?.products.map((product: ProductProps) => (
          <div key={product._id} className="mb-7">
            <Link href={`/products/${product.slug}`}>
              <div className="background-light800_dark300 text-dark400_light900">
                <div
                  className="flex relative h-72 w-full max-w-52 justify-center items-center"
                  style={{ aspectRatio: 70 / 45 }}
                >
                  <Image
                    className="rounded-md"
                    src={product.productImage}
                    fill
                    priority
                    alt=""
                    sizes="(max-width: 768px) 100vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="text-sm font-normal ">
                  <p className="overflow-hidden break-words max-w-48">
                    {product.name}
                  </p>
                  {product.price === "0" ? (
                    <p>Gratuito</p>
                  ) : (
                    <p>
                      {parseFloat(product.price).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Browse;
