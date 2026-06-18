import { useQuery } from "@tanstack/react-query";
import { getToken, getUser, getUsers, updateUser } from "./api";
import { UserProps } from "@/types/index.d";

interface UsersResponse {
  users: UserProps[];
  totalUsers?: number;
  isNext?: boolean;
}

export function useUsers(searchQuery: Record<string, string>) {
  return useQuery<UsersResponse>({
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
