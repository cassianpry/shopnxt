"use client";
import React, { useState, use } from "react";
import { useOrders } from "@/app/services/orders/queries";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/search/SearchBar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderProps, SearchParamsProps } from "@/types/index.d";
import Link from "next/link";
import OrderModal from "@/components/order/OrderModal";

function Orders(props: SearchParamsProps) {
  const searchParams = use(props.searchParams);
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState("");

  const orders = useOrders({
    searchQuery: searchParams.query,
    page: (searchParams.page ? +searchParams.page : 1).toString(),
    pageSize: (searchParams.pageSize || 10).toString(),
  });

  const handleOrder = (id: React.SetStateAction<string>) => {
    setOrder(id);
    setIsOpen(true);
  };

  const { data: fetchedOrders, isLoading } = orders;

  if (isLoading) {
    return (
      <section>
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
      </section>
    );
  }

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 pt-12">Vendas</h1>
      <Separator orientation="horizontal" className="bg-light-400" />
      <div className="w-full">
        <div className="items-center py-4 text-dark400_light900">
          <div className="flex justify-start gap-3 pb-4">
            <SearchBar route="/dashboard/orders" />
          </div>
          {fetchedOrders?.orders.length > 0 ? (
            <div className="flex mx-auto border rounded-md mt-1 text-dark400_light900">
              <Table>
                <TableHeader>
                  <TableRow className="text-light-700 bg-blue-900">
                    <TableHead className="">Nº Pedido</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(fetchedOrders?.orders as OrderProps[])?.map((order) => (
                    <TableRow
                      key={order._id}
                      className="hover:background-light700_dark400 hover:cursor-pointer"
                      onClick={() => handleOrder(order._id!)}
                    >
                      <TableCell className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-10 hover:text-blue-600">
                        {order.orderNum}
                      </TableCell>

                      <TableCell>{order.name}</TableCell>
                      <TableCell>{order.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-light400_light500 pt-10">Não há vendas.</div>
          )}
          <div className="flex items-center justify-between space-x-2 py-4 text-dark300_light700">
            <div className="flex-1 text-sm text-muted-foreground">
              {searchParams.query !== undefined &&
              fetchedOrders?.length !== undefined ? (
                <>
                  <span className="font-semibold text-md">
                    Total de vendas encontradas:
                  </span>
                  &nbsp;
                  {fetchedOrders?.orders.length}
                </>
              ) : fetchedOrders?.orders !== undefined ? (
                <>
                  <span className="font-semibold text-md">
                    Total de vendas:
                  </span>
                  &nbsp;
                  {fetchedOrders?.totalOrders}
                </>
              ) : (
                ""
              )}
            </div>
            <Pagination
              pageNumber={searchParams?.page ? +searchParams.page : 1}
              isNext={fetchedOrders?.isNext}
              total={fetchedOrders?.totalOrders ?? 0}
            />
          </div>
        </div>
      </div>
      <OrderModal isOpen={isOpen} setIsOpen={setIsOpen} orderId={order} />
    </div>
  );
}

export default Orders;
