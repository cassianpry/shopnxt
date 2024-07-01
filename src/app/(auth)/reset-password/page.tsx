"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToken } from "@/app/services/users/queries";
import { useUpdatePassword } from "@/app/services/users/mutations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResetPasswordSchema } from "@/lib/actions/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MdAutorenew, MdKey, MdLogin } from "react-icons/md";
import { GoPasskeyFill } from "react-icons/go";
import { toast } from "@/components/ui/use-toast";
import LoadingResetPassword from "@/components/loadings/LoadingResetPassword";

interface ResetPasswordProps {
  searchParams: {
    token: string;
  };
}

function ResetPassword({ searchParams }: ResetPasswordProps) {
  const token = useToken({ token: searchParams?.token?.toString() });
  const updatePassword = useUpdatePassword();
  const userId = token?.data?.checkToken?.userId;
  const router = useRouter();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      userId: userId,
      password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    if (!token.isLoading && token?.error !== null) {
      router.push("/");
    }
  }, [token, router]);

  // if (!token.isLoading && token?.error !== null) {
  //   router.push("/");
  // }

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    values.userId = userId;

    try {
      updatePassword.mutate(values);
    } catch (error) {
      toast({
        className: "bg-red-600 text-light-800",
        title: "Entre em contato com o suporte",
        description: error + " informe esse erro ao suporte",
      });
    }
  };

  console.log(token?.data?.checkToken);

  return (
    <main className="flex flex-row mx-auto items-center justify-center h-screen w-1/3 max-xl:w-1/2">
      {token.isLoading ? (
        <LoadingResetPassword />
      ) : !token.isLoading && token?.error !== null ? (
        "Token Inválido"
      ) : (
        <div className="container">
          <h1 className="flex items-center text-center text-slate-700 text-3xl font-bold justify-center dark:text-light-900">
            <GoPasskeyFill className="w-9 h-9" />
            &nbsp;&nbsp;Trocar a senha
          </h1>

          <p className="pt-10 text-red-600 text-center">
            *<span className="text-dark400_light900">campos obrigatórios</span>
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-8 pt-2 justify-center text-center items-center text-dark400_light800"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="flex text-md font-medium text-left">
                      <span className="text-red-600 ">*</span>&nbsp;Nova senha
                    </FormLabel>
                    <FormMessage className="text-red-600" />
                    <FormControl>
                      <Input
                        className="w-[100%] dark:text-dark-500 font-semibold"
                        type="password"
                        placeholder="johndoe@example.com"
                        autoComplete="password"
                        disabled={updatePassword.isPending}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="flex text-start justify-between text-md font-medium">
                      <div>
                        <span className="text-red-600">*</span>
                        <span>&nbsp;Confirmar senha</span>
                      </div>
                    </FormLabel>
                    <FormMessage className="text-red-600" />
                    <FormControl>
                      <Input
                        className="w-[100%] dark:text-dark-500 font-semibold focus:ring-0 focus:ring-offset-0"
                        type="password"
                        autoComplete="currentPassword"
                        disabled={updatePassword.isPending}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={updatePassword.isPending}
                className="bg-blue-900 text-light-850 text-md p-6 w-full hover:bg-blue-600"
              >
                {updatePassword.isPending ? (
                  <>
                    <MdAutorenew className="w-5 h-5 mr-2 animate-spin" />
                    <p className="animate-pulse">Trocando a senha...</p>
                  </>
                ) : (
                  <>
                    <MdKey className="w-5 h-5 mr-2" />
                    Trocar a senha
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </main>
  );
}

export default ResetPassword;
