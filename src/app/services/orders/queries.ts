import { useQuery } from "@tanstack/react-query";
import { getOrder, getOrders } from "./api";

export function useOrders(searchQuery: Record<string, string> = {}) {
  return useQuery({
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
