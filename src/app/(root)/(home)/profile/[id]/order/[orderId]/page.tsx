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
          <Skeleton className="h-4 w-[250px] bg-dark-500" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl bg-dark-500" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-dark-500" />
            <Skeleton className="h-4 w-[200px] bg-dark-500" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row text-text-high justify-between gap-8">
          <div className="flex flex-col gap-3 lg:max-w-[50%]">
            <div className="flex flex-col items-center">
              <MdOutlineCheckCircle className="text-green-500 w-48 h-48" />
              <h1 className="font-bold text-4xl pb-10">
                Pedido realizado com sucesso
              </h1>
            </div>
            <div className="flex flex-col gap-3 text-text-body">
              <h3 className="font-semibold text-lg text-text-high pb-5">
                Obrigado por comprar conosco!
              </h3>
              <p>
                Você irá receber um e-mail de confirmação com os detalhes da sua
                compra.
              </p>
              <p>
                Nº do pedido:&nbsp;
                <span className="text-accent underline">
                  {order.data.orderNum}
                </span>
              </p>
              <Link
                href="/"
                className="mt-16 p-3 flex items-center justify-center rounded-md font-semibold text-sm text-white bg-accent hover:bg-accent-hover transition-all duration-300 ease-in-out"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
          <div className="flex flex-col lg:max-w-[50%]">
            <h3 className="font-semibold text-lg text-text-high pb-5">Items do Pedido</h3>
            <div className="border border-dark-400 rounded-lg overflow-hidden">
              <Table className="border-b border-dark-400">
                <TableHeader>
                  <TableRow className="bg-dark-400">
                    <TableHead className="w-[300px] font-bold text-text-high">Nome</TableHead>
                    <TableHead className="font-bold text-text-high">Preço</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.data.cartProducts.map((product: ProductProps) => (
                    <TableRow key={product._id} className="border-dark-400">
                      <TableCell className="text-text-body">{product.name}</TableCell>
                      <TableCell className="text-text-body" key={product._id}>{product.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between font-bold bg-dark-400 text-text-high p-3">
                <span>Total:</span>
                <span>
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
