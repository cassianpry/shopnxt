import { OrderProps, ProductProps } from "@/types/index.d";
import React from "react";
import { Skeleton } from "../ui/skeleton";

interface RecentSalesProps {
  orders: OrderProps[];
  isLoading?: boolean;
}

const RecentSales: React.FC<RecentSalesProps> = ({ orders, isLoading }) => {
  return (
    <div className="bg-dark-300 border border-dark-400 rounded-xl p-6 col-span-3">
      <div>
        <div className="flex flex-row items-center justify-between space-y-0 mb-4">
          <h3 className="text-text-high text-lg font-semibold">Vendas recentes</h3>
        </div>
        <div>
          {isLoading ? (
            <Skeleton className="h-4 w-52 bg-dark-400" />
          ) : (
            <p className="text-xs text-text-muted">
              Você fez {orders?.length} venda(s) esse mes.
            </p>
          )}
        </div>
        <div className="pt-4 space-y-4">
          {orders?.map((order: OrderProps) => (
            <div key={order._id}>
              <div className="flex items-center">
                {isLoading ? (
                  <Skeleton className="h-4 w-52 bg-dark-400" />
                ) : (
                  <div>
                    <p className="text-text-body text-sm">{order.name}</p>
                    <p className="text-text-muted text-xs">{order.email}</p>
                  </div>
                )}

                <div className="ml-auto text-text-body text-sm">
                  {isLoading ? (
                    <Skeleton className="h-4 w-14 bg-dark-400" />
                  ) : (
                    <p>
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
                    </p>
                  )}
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
