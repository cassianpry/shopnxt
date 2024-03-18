import { useQuery } from "@tanstack/react-query";
import { getProduct, getProductBySlug, getProducts } from "./api";

export function useProducts(searchQuery: Record<string, string>) {
  return useQuery({
    queryKey: ["products", searchQuery],
    queryFn: () => getProducts(searchQuery),
  });
}

export function useProduct(_id: string) {
  return useQuery({
    queryKey: ["products", _id],
    queryFn: () => getProduct(_id),
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ["products", slug],
    queryFn: () => getProductBySlug(slug),
  });
}
