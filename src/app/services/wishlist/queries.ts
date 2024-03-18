import { useQuery } from "@tanstack/react-query";
import { getWishList } from "./api";

export function useWishListUser(id: string | undefined) {
  return useQuery({
    queryKey: ["wishlists", id],
    queryFn: () => getWishList(id),
  });
}
