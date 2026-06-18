"use client";
import React, { use } from "react";
import { useOrders } from "../services/orders/queries";
import { useUsers } from "../services/users/queries";

import { SearchParamsProps } from "@/types/index.d";
import RecentSales from "@/components/dashboard/RecentSales";
import QuantitySales from "@/components/dashboard/QuantitySales";
import { MdPeopleAlt } from "react-icons/md";
import TotalSales from "@/components/dashboard/TotalSales";
import QuantityUsers from "@/components/dashboard/QuantityUsers";

const AdminDashboard = (props: SearchParamsProps) => {
  const searchParams = use(props.searchParams);
  const orders = useOrders();
  const users = useUsers({ searchQuery: searchParams.query });

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {orders?.isLoading}
        <QuantitySales
          orders={orders?.data?.orders ?? []}
          isLoading={orders?.isLoading}
        />
        <TotalSales
          orders={orders?.data?.orders ?? []}
          isLoading={orders?.isLoading}
        />
        <QuantityUsers
          users={users?.data?.users ?? []}
          isLoading={users?.isLoading}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-5">
        <RecentSales
          orders={orders?.data?.orders ?? []}
          isLoading={users?.isLoading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
