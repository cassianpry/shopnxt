"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { redirect, useParams } from "next/navigation";
import { useOrder } from "@/app/services/orders/queries";
import { OrderProps, UserProps } from "@/types/index.d";
import Image from "next/image";
import moment from "moment";
import { useSession } from "next-auth/react";
import Link from "next/link";

const UserOrders = () => {
  const params = useParams<{ id: string }>();
  const orders = useOrder(params.id.toString());
  const { data, status } = useSession();

  if (status !== "authenticated") {
    redirect("/");
  }

  console.log(orders?.data);

  return (
    <div className="flex text-dark400_light900 max-w-[700px]">
      {(data?.user && orders?.data === null) || orders?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="mt-10 text-3xl font-bold">
            Você não fez nenhuma compra...
          </span>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <h1 className="font-bold text-4xl pb-10">Seus pedidos</h1>
          <Accordion
            type="single"
            collapsible
            className="flex flex-col gap-5 w-auto"
          >
            {orders?.data?.map((order: OrderProps) => (
              <AccordionItem key={order._id} value={order._id!}>
                <div className="flex justify-between items-center gap-5">
                  <AccordionTrigger />
                  <div className="w-full">
                    Nº do Pedido:&nbsp;
                    <Link
                      href={`/profile/${(data.user as UserProps)._id}/order/${
                        order.orderNum
                      }`}
                      className="text-blue-600 hover:text-green-400"
                    >
                      {order.orderNum}
                    </Link>
                  </div>
                  <p>
                    Data:&nbsp;
                    <span className="text-green-600">
                      {moment(order?.createdAt).locale("pt-br").format("L")}
                    </span>
                  </p>
                </div>
                {order.cartProducts.map((product) => (
                  <AccordionContent key={product._id} className="flex">
                    <Image
                      className="max-w-24 max-h-12"
                      src={product.productImage}
                      width={150}
                      height={150}
                      alt={product.name}
                    />
                    <div className="flex flex-col justify-start">
                      <span>{product.name}</span>
                      <span>
                        {parseFloat(product.price).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                  </AccordionContent>
                ))}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
