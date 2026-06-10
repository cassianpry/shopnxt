import { useQuery } from "@tanstack/react-query";
import { getGenre, getGenres } from "./api";

export function useGenres(searchQuery: Record<string, string> = {}) {
  return useQuery({
    queryKey: ["genres", searchQuery],
    queryFn: () => getGenres(searchQuery),
  });
}

export function useGenre(_id: string | "") {
  return useQuery({
    queryKey: ["genres", _id],
    queryFn: () => getGenre(_id),
  });
}
