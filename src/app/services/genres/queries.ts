import { useQuery } from "@tanstack/react-query";
import { getGenre, getGenres } from "./api";

interface GenresResponse {
  genre: { _id: string; name: string; slug: string }[];
  totalGenres?: number;
  isNext?: boolean;
}

export function useGenres(searchQuery: Record<string, string> = {}) {
  return useQuery<GenresResponse>({
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
