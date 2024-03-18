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
    <div className="rounded-xl border dark:border-gray-700 background-light800_dark300 shadow">
      <div className="flex flex-row items-center justify-between space-y-0 m-3 md:gap-10">
        <h3 className="tracking-tight body-semibold">Total geral de vendas</h3>
        <BiDollar className="h-4 w-4 base-regular" />
      </div>
      <div className="m-3">
        {isLoading ? (
          <div className="pt-1">
            <Skeleton className="h-4 w-[50px] bg-gray-500" />{" "}
          </div>
        ) : (
          <p>
            +
            {totalOrdersValue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        )}

        {isLoading ? (
          <div className="pt-1">
            <Skeleton className="h-4 w-[50px] bg-gray-500" />
          </div>
        ) : (
          <p className="small-regular text-gray-500">
            +{totalGrowPercentage.toFixed(2)}% desde o ultimo mês.
          </p>
        )}
      </div>
    </div>
  );
};

export default TotalSales;
