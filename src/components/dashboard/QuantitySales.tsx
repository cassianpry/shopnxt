import { OrderProps } from "@/types/index.d";
import moment from "moment";
import React from "react";
import { MdCreditCard } from "react-icons/md";
import { Skeleton } from "../ui/skeleton";

interface QuantitySalesProps {
  orders: OrderProps[];
  isLoading: boolean;
}

const QuantitySales: React.FC<QuantitySalesProps> = ({ orders, isLoading }) => {
  //Total sales based on last month
  const lastMonthOrders = orders?.filter((order) =>
    moment(order?.createdAt).isSame(moment().subtract(1, "month"), "month")
  );

  //Total sales based on current month
  const currentMonthSalesCount = orders?.filter((order) =>
    moment(order?.createdAt).isSame(moment(), "month")
  );

  // Calculates sales percentage (last month - atual month)
  const salesPercentage =
    ((currentMonthSalesCount?.length - lastMonthOrders?.length) /
      lastMonthOrders?.length) *
    100;

  return (
    <div className="bg-dark-300 border border-dark-400 rounded-xl p-6">
      <div className="flex flex-row items-center justify-between space-y-0 mb-4">
        <h3 className="text-text-muted text-sm">Quantidade de vendas</h3>
        <MdCreditCard className="h-5 w-5 text-accent" />
      </div>
      <div>
        <div className="text-text-high text-3xl font-bold">
          {isLoading ? (
            <Skeleton className="h-4 w-[25px] bg-dark-400 rounded-full" />
          ) : (
            <p>+{currentMonthSalesCount?.length}</p>
          )}
        </div>
        <div>
          {isLoading ? (
            <div className="pt-1">
              <Skeleton className="h-4 w-[100px] bg-dark-400 rounded-full" />
            </div>
          ) : (
            <p className="text-xs text-text-muted">
              +{salesPercentage}% desde o ultimo mês
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantitySales;
