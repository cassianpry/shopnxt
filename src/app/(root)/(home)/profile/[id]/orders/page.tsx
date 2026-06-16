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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 pb-16">
      <h1 className="font-bold text-4xl text-text-high mb-8">Seus pedidos</h1>
      {(data?.user && orders?.data === null) || orders?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="mt-10 text-3xl font-bold text-text-high">
            Você não fez nenhuma compra...
          </span>
        </div>
      ) : (
        <div className="flex flex-col w-full max-w-[700px]">
          <Accordion
            type="single"
            collapsible
            className="flex flex-col gap-5 w-auto"
          >
            {orders?.data?.map((order: OrderProps) => (
              <AccordionItem key={order._id} value={order._id!}>
                <div className="flex justify-between items-center gap-5">
                  <AccordionTrigger />
                  <div className="w-full text-text-body">
                    Nº do Pedido:&nbsp;
                    <Link
                      href={`/profile/${(data.user as UserProps)._id}/order/${
                        order.orderNum
                      }`}
                      className="text-accent hover:text-text-high transition-colors"
                    >
                      {order.orderNum}
                    </Link>
                  </div>
                  <p className="text-text-body text-sm">
                    Data:&nbsp;
                    <span className="text-text-high">
                      {moment(order?.createdAt).locale("pt-br").format("L")}
                    </span>
                  </p>
                </div>
                {order.items?.map((product) => (
                  <AccordionContent key={product._id} className="flex gap-4 text-text-body">
                    <Image
                      className="max-w-24 max-h-12 rounded"
                      src={product.productImage}
                      width={150}
                      height={150}
                      alt={product.name}
                    />
                    <div className="flex flex-col justify-start">
                      <span className="text-text-high">{product.name}</span>
                      <span>
                        {Number(product.price).toLocaleString("pt-BR", {
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
