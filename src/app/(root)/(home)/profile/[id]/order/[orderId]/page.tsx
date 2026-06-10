"use client";
import { useOrder } from "@/app/services/orders/queries";
import OrderShipmentCard from "@/components/order/OrderShipmentCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderProps, ProductProps } from "@/types/index.d";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { MdOutlineCheckCircle } from "react-icons/md";

const UserOrder = () => {
  const params = useParams<{ id: string; orderId: string }>();
  const order = useOrder(params.orderId.toString());

  return (
    <>
      {order.isLoading ? (
        <div className="flex flex-col space-y-3 my-20">
          <Skeleton className="h-4  w-[250px] bg-gray-500" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gray-500" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-gray-500" />
            <Skeleton className="h-4 w-[200px] bg-gray-500" />
          </div>
        </div>
      ) : (
        <div className="flex text-dark400_light900 justify-between">
          <div className="flex flex-col gap-3 max-w-[50%]">
            <div className="flex flex-col items-center">
              <MdOutlineCheckCircle className="text-green-600 w-48 h-48" />
              <h1 className="font-bold text-4xl pb-10">
                Pedido realizado com sucesso
              </h1>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="h3-semibold pb-5">
                Obrigado por comprar conosco!
              </h3>
              <p>
                Você irá receber um e-mail de confirmação com os detalhes da sua
                compra.
              </p>
              <p>
                Nº do pedido:&nbsp;
                <span className="text-blue-600 underline">
                  {order.data.orderNum}
                </span>
              </p>
              <Link
                href="/"
                className="focus:shadow-outline mt-16 p-3 flex items-center justify-center rounded-md font-semibold text-sm text-light-900 bg-blue-900 hover:bg-blue-600 transition-all duration-300 ease-in-out"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
          <div className="flex flex-col max-w-[50%]">
            <h3 className="h3-semibold pb-5">Items do Pedido</h3>
            <div className="border">
              <Table className="border-b">
                <TableHeader>
                  <TableRow className="bg-gray-500">
                    <TableHead className="w-[300px] font-bold">Nome</TableHead>
                    <TableHead className="font-bold">Preço</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.data.cartProducts.map((product: ProductProps) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell key={product._id}>{product.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between font-bold bg-gray-500">
                <span className="m-3">Total:</span>
                <span className="m-3">
                  {order.data.totalPrice.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
            <OrderShipmentCard order={order.data as OrderProps} />
          </div>
        </div>
      )}
    </>
  );
};

export default UserOrder;
