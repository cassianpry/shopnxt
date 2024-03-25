"use client";
import React from "react";
import SearchBar from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MdAddCircleOutline } from "react-icons/md";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ProductProps, SearchParamsProps } from "@/types/index.d";
import Link from "next/link";

import { useProducts } from "@/app/services/product/queries";
import Pagination from "@/components/Pagination";
import ProductRow from "@/components/product/ProductRow";
import { Skeleton } from "@/components/ui/skeleton";

function Products({ searchParams }: SearchParamsProps) {
  const products = useProducts({
    searchQuery: searchParams.query,
    page: (searchParams.page ? +searchParams.page : 1).toString(),
    pageSize: (searchParams.pageSize || 10).toString(),
  });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 pt-12">Produtos</h1>
      <Separator orientation="horizontal" className="bg-light-400" />

      <div className="w-full">
        <div className="items-center py-4">
          <div className="flex justify-start gap-3 pb-4">
            <SearchBar route="/dashboard/products" />

            <Link href="/dashboard/products/new">
              <Button
                type="button"
                className="focus:shadow-outline flex items-center justify-center rounded-lg py-7 font-semibold text-lg tracking-wide text-light-900 transition-all duration-300 ease-in-out bg-blue-900 hover:bg-blue-600"
              >
                <MdAddCircleOutline className="h-5 w-5" />
                <span className="ml-3">Novo produto</span>
              </Button>
            </Link>
          </div>

          {products?.data?.products?.length > 0 && !products.isFetching ? (
            <div className="flex mx-auto border rounded-md mt-1 text-dark400_light900">
              <Table>
                <TableHeader>
                  <TableRow className="text-light-700 bg-blue-900">
                    <TableHead>Nome</TableHead>
                    <TableHead className="max-xl:hidden">
                      Breve Descrição
                    </TableHead>
                    <TableHead className="max-xl:hidden">Gênero(s)</TableHead>
                    <TableHead>Desenvolvedora</TableHead>
                    <TableHead>Editora</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(products?.data?.products as ProductProps[])?.map(
                    (product) => (
                      <ProductRow
                        key={product._id}
                        product={product}
                        isLoading={products.isLoading}
                        isFetching={products.isFetching}
                      />
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          ) : products?.data?.products?.length === 0 && !products.isFetching ? (
            <div className="text-light400_light500 pt-10">
              Nenhum produto cadastrado.
            </div>
          ) : (
            <div>
              <h1 className="h1-bold text-dark100_light900"></h1>
              <div className="my-12 pt-5 flex flex-wrap gap-5 items-center space-x-4">
                <div className="flex flex-col space-y-2 justify-center items-center gap-3">
                  <Skeleton className="h-4 w-[350px] bg-gray-500" />
                  <Skeleton className="h-4 w-[350px] bg-gray-500" />
                  <Skeleton className="h-4 w-[350px] bg-gray-500" />
                  <Skeleton className="h-4 w-[350px] bg-gray-500" />
                  <Skeleton className="h-4 w-[350px] bg-gray-500" />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between space-x-2 py-4 text-dark300_light700">
            <div className="flex-1 text-sm text-muted-foreground">
              {searchParams.query !== undefined &&
              products?.data?.products !== undefined ? (
                <>
                  <span className="font-semibold text-md">
                    Total de produtos encontrados:
                  </span>
                  &nbsp;
                  {products?.data.products.length}
                </>
              ) : products?.data?.products !== undefined ? (
                <>
                  <span className="font-semibold text-md">
                    Total de produtos cadastrados:
                  </span>
                  &nbsp;
                  {products?.data?.totalProducts}
                </>
              ) : (
                ""
              )}
            </div>
            <Pagination
              pageNumber={searchParams?.page ? +searchParams.page : 1}
              isNext={products?.data?.isNext}
              total={products?.data?.totalProducts ?? 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
