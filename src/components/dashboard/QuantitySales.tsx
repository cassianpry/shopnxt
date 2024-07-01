import { OrderProps } from "@/types/index.d";
import moment from "moment";
import React from "react";
import { MdCreditCard } from "react-icons/md";
import { Skeleton } from "../ui/skeleton";
import "moment/locale/pt-br";

interface QuantitySalesProps {
  orders: OrderProps[];
  isLoading: boolean;
}
moment.locale("pt-br");

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

  const currentMonth = moment().format("MMMM");

  return (
    <div className="rounded-xl border dark:border-gray-700 background-light800_dark300 shadow">
      <div className="flex flex-row items-center justify-between space-y-0 m-3 md:gap-10">
        <h3 className="tracking-tight body-semibold">
          Quantidade de vendas ({currentMonth})
        </h3>
        <MdCreditCard className="h-4 w-4 base-regular" />
      </div>
      <div className="m-3 items-center justify-center">
        <div className="h3-semibold">
          {isLoading ? (
            <Skeleton className="h-4 w-[25px] bg-gray-500 rounded-full" />
          ) : (
            <p>+{currentMonthSalesCount?.length}</p>
          )}
        </div>
        <div>
          {isLoading ? (
            <div className="pt-1">
              <Skeleton className="h-4 w-[100px] bg-gray-500 rounded-full" />
            </div>
          ) : (
            <p className="small-regular text-gray-500">
              +{Number.isNaN(salesPercentage) ? 0 : salesPercentage}% desde o
              ultimo mês
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantitySales;
