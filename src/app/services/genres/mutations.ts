import { FormGenreValues } from "@/types/index.d";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGenre, updateGenre } from "./api";

export function useCreateGenre() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormGenreValues) => createGenre(data),

    onError: (error) => {
      console.log("Error=>", error);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["genres"] });
      }
    },
  });
}

export function useUpdateGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormGenreValues) => updateGenre(data),
    onError: (error) => {
      console.log("Error=>", error);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["genres"] });
      }
    },
  });
}
