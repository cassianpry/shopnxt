import { UserProps, UserRegisterProps } from "@/types/index.d";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  resetPasswordUser,
  updatePasswordUser,
  updateUser,
} from "./api";
import { useRouter, useSearchParams } from "next/navigation";

export function useRegisterUser() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserRegisterProps) => registerUser(data),

    onError: (error) => {
      console.log("Error=>", error);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["users"] });
        router.push("/sign-in");
      }
    },
  });
}

export function useLoginUser() {
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackUrl");
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => loginUser(data),

    onError: (error) => {
      console.log("Error=>", error);
    },
    onSettled: async (_, error) => {
      if (error) {
        console.error(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["users"] });
        router.push(callbackURL ? callbackURL : "/");
      }
    },
  });
}

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
