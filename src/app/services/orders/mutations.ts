import { OrderProps } from "@/types/index.d";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createOrder } from "./api";

export function useCreateOrder() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: OrderProps) => createOrder(data),
    onError: (error) => {
      console.log("Error=>", error);
    },
    onSettled: async (data, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["orders"] });
        router.push(`/profile/${data.userId}/order/${data.orderId}`);
      }
    },
  });
}
