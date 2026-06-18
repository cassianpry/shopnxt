"use client";
import React, { use } from "react";
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

import { SearchParamsProps } from "@/types/index.d";
import Link from "next/link";

import { useProducts } from "@/app/services/product/queries";
import Pagination from "@/components/Pagination";
import ProductRow from "@/components/product/ProductRow";
import { Skeleton } from "@/components/ui/skeleton";

function Products(props: SearchParamsProps) {
  const searchParams = use(props.searchParams);
  const products = useProducts({
    searchQuery: searchParams.query,
    page: (searchParams.page ? +searchParams.page : 1).toString(),
    pageSize: (searchParams.pageSize || 10).toString(),
  });

  return (
    <div>
      <h1 className="text-text-high text-2xl font-bold font-spaceGrotesk pt-12">Produtos</h1>
      <Separator orientation="horizontal" className="bg-dark-400" />

      <div className="w-full">
        <div className="items-center py-4">
          <div className="flex justify-start gap-3 pb-4">
            <SearchBar route="/dashboard/products" />

            <Link href="/dashboard/products/new">
              <Button
                type="button"
                className="focus:shadow-outline flex items-center justify-center rounded-lg py-7 font-semibold text-lg tracking-wide text-white transition-all duration-300 ease-in-out bg-accent hover:bg-accent-hover"
              >
                <MdAddCircleOutline className="h-5 w-5" />
                <span className="ml-3">Novo produto</span>
              </Button>
            </Link>
          </div>

          {(products?.data?.products?.length ?? 0) > 0 && !products.isFetching ? (
            <div className="flex mx-auto border rounded-md mt-1 text-text-high">
              <Table>
                <TableHeader>
                  <TableRow className="text-text-high bg-accent">
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
                   {products?.data?.products?.map(
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
            <div className="text-text-muted pt-10">
              Nenhum produto cadastrado.
            </div>
          ) : (
            <div>
              <h1 className="text-text-high text-2xl font-bold font-spaceGrotesk"></h1>
              <div className="my-12 pt-5 flex flex-wrap gap-5 items-center space-x-4">
                <div className="flex flex-col space-y-2 justify-center items-center gap-3">
                  <Skeleton className="h-4 w-[350px] bg-dark-500" />
                  <Skeleton className="h-4 w-[350px] bg-dark-500" />
                  <Skeleton className="h-4 w-[350px] bg-dark-500" />
                  <Skeleton className="h-4 w-[350px] bg-dark-500" />
                  <Skeleton className="h-4 w-[350px] bg-dark-500" />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between space-x-2 py-4 text-text-body">
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
