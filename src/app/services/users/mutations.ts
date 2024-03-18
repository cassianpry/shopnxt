import { UserProps } from "@/types/index.d";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetPasswordUser, updatePasswordUser, updateUser } from "./api";
import { useRouter } from "next/navigation";

// export function useCreateUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data: FormProfileProps) => createUser(data),

//     onError: (error) => {
//       console.log("Error=>", error);
//     },
//     onSettled: async (_, error) => {
//       if (error) {
//         console.error(error);
//       } else {
//         await queryClient.invalidateQueries({ queryKey: ["users"] });
//       }
//     },
//   });
// }

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserProps) => updateUser(data),
    onError: (error) => {
      console.log("Error=>", error);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (values: any) => resetPasswordUser(values),
    onError: (error) => {
      console.log("Error=>", error);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["users"] });
        router.push("/success");
      }
    },
  });
}

export function useUpdatePassword() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (values: any) => updatePasswordUser(values),
    onError: (error) => {
      console.log("Error=>", error);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        router.push("/sign-in");
      }
    },
  });
}
