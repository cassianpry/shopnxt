import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWishList, deleteProductWishList } from "./api";

export function useCreateWishList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user, product }: { user: string; product: string }) =>
      createWishList({ user, product }),

    onError: (error) => {
      console.log("Error=>", error);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error("WishListMutation =>", error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["wishlists"],
        });
      }
    },
  });
}

export function useDeleteProductWishList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user, product }: { user: string; product: string }) =>
      deleteProductWishList({ user, product }),

    onError: (error) => {
      console.log("Error=>", error);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error("WishListMutation =>", error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["wishlists"],
        });
      }
    },
  });
}
