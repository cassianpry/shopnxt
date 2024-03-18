import { ProductProps } from "@/types/index.d";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "./api";
import { useRouter } from "next/navigation";

export function useCreateProduct() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductProps) => createProduct(data),

    onError: (error) => {
      console.log("Error=>", error);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["products"] });
        router.push("/dashboard/products");
      }
    },
  });
}

export function useUpdateProduct() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductProps) => updateProduct(data),

    onError: (error) => {
      console.log("Error=>", error);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["products"] });
        router.push("/dashboard/products");
      }
    },
  });
}
