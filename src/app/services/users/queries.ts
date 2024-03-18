import { useQuery } from "@tanstack/react-query";
import { getToken, getUser, getUsers } from "./api";

export function useUsers(searchQuery: Record<string, string>) {
  return useQuery({
    queryKey: ["users", searchQuery],
    queryFn: () => getUsers(searchQuery),
  });
}

export function useUser(_id: string) {
  return useQuery({
    queryKey: ["users", _id],
    queryFn: () => getUser(_id),
  });
}

export function useToken(searchQuery: Record<string, string>) {
  return useQuery({
    queryKey: ["users", searchQuery],
    queryFn: () => getToken(searchQuery),
  });
}
