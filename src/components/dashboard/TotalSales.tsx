import { calculateTotalMonthOrders, growPercentage } from "@/lib/utils";
import { OrderProps } from "@/types/index.d";
import moment from "moment";
import React from "react";
import { BiDollar } from "react-icons/bi";
import { Skeleton } from "../ui/skeleton";

interface TotalSalesProps {
  orders: OrderProps[];
  isLoading: boolean;
}

const TotalSales: React.FC<TotalSalesProps> = ({ orders, isLoading }) => {
  const totalOrdersValue = calculateTotalMonthOrders(orders);

  const totalGrowPercentage = growPercentage(orders);

  return (
    <div className="bg-dark-300 border border-dark-400 rounded-xl p-6">
      <div className="flex flex-row items-center justify-between space-y-0 mb-4">
        <h3 className="text-text-muted text-sm">Total geral de vendas</h3>
        <BiDollar className="h-5 w-5 text-accent" />
      </div>
      <div>
        {isLoading ? (
          <div className="pt-1">
            <Skeleton className="h-4 w-[50px] bg-dark-400" />{" "}
          </div>
        ) : (
          <p className="text-text-high text-3xl font-bold">
            +
            {totalOrdersValue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        )}

        {isLoading ? (
          <div className="pt-1">
            <Skeleton className="h-4 w-[50px] bg-dark-400" />
          </div>
        ) : (
          <p className="text-xs text-text-muted">
            +{totalGrowPercentage.toFixed(2)}% desde o ultimo mês.
          </p>
        )}
      </div>
    </div>
  );
};

export default TotalSales;
