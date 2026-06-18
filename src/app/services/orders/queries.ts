import { useQuery } from "@tanstack/react-query";
import { getOrder, getOrders } from "./api";
import { OrderProps } from "@/types/index.d";

interface OrdersResponse {
  orders: OrderProps[];
  totalOrders?: number;
  isNext?: boolean;
}

export function useOrders(searchQuery: Record<string, string> = {}) {
  return useQuery<OrdersResponse>({
    queryKey: ["orders", searchQuery],
    queryFn: () => getOrders(searchQuery),
  });
}

export function useOrder(_id: string | "") {
  return useQuery({
    queryKey: ["orders", _id],
    queryFn: () => getOrder(_id),
  });
}
