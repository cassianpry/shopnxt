import { OrderProps, ProductProps } from "@/types/index.d";
import React from "react";

interface RecentSalesProps {
  orders: OrderProps[];
}

const RecentSales: React.FC<RecentSalesProps> = ({ orders }) => {
  return (
    <div className="rounded-xl border dark:border-gray-700 background-light800_dark300 shadow col-span-3">
      <div className="m-3">
        <div className="flex flex-row items-center justify-between space-y-0 md:gap-10">
          <h3 className="tracking-tight base-semibold">Vendas recentes</h3>
        </div>
        <div className="items-center justify-center">
          <p className="small-regular text-gray-500">
            Você fez {orders?.length} venda(s) esse mes.
          </p>
        </div>
        <div className="pt-3">
          {orders?.map((order: OrderProps) => (
            <div key={order._id} className="space-y-8 my-5">
              <div className="flex items-center">
                <div className="space-y-0">
                  <p>{order.name}</p>
                  <p className="text-gray-500">{order.email}</p>
                </div>
                <div className="ml-auto paragraph-regular">
                  {order.cartProducts
                    .reduce(
                      (total: number, product: ProductProps) =>
                        total + parseFloat(product.price),
                      0
                    )
                    .toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentSales;
