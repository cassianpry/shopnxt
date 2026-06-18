"use client";
import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { MdAutorenew, MdKey } from "react-icons/md";
import { GoPasskeyFill } from "react-icons/go";
import { toast } from "@/components/ui/use-toast";
import LoadingResetPassword from "@/components/loadings/LoadingResetPassword";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = useToken({ token: searchParams.get("token") ?? "" });
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
        className: "bg-red-600 text-text-high",
        title: "Entre em contato com o suporte",
        description: error + " informe esse erro ao suporte",
      });
    }
  };

  console.log(token?.data?.checkToken);

  return (
    <main className="min-h-screen bg-dark-100 flex items-center justify-center">
      {token.isLoading ? (
        <LoadingResetPassword />
      ) : !token.isLoading && token?.error !== null ? (
        <div className="text-red-400 text-lg font-semibold">Token Inválido</div>
      ) : (
        <div className="bg-dark-300 border border-dark-400 rounded-xl p-8 w-full max-w-md mx-4">
          <h1 className="font-spaceGrotesk text-2xl font-bold text-text-high text-center mb-6 flex items-center justify-center gap-2">
            <GoPasskeyFill className="w-7 h-7 text-accent" />
            Trocar a senha
          </h1>

          <p className="mb-6 text-red-400 text-xs text-center">
            *<span className="text-text-body">campos obrigatórios</span>
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-5"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-body text-sm mb-1 block">
                      <span className="text-red-400">*</span>&nbsp;Nova senha
                    </FormLabel>
                    <FormMessage className="text-red-400 text-xs" />
                    <FormControl>
                      <Input
                        className="w-full bg-dark-400 border border-dark-500 rounded-md px-4 py-2.5 text-sm text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                        type="password"
                        placeholder="Nova senha"
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
                  <FormItem>
                    <FormLabel className="flex text-text-body text-sm mb-1 justify-between">
                      <div>
                        <span className="text-red-400">*</span>
                        <span>&nbsp;Confirmar senha</span>
                      </div>
                    </FormLabel>
                    <FormMessage className="text-red-400 text-xs" />
                    <FormControl>
                      <Input
                        className="w-full bg-dark-400 border border-dark-500 rounded-md px-4 py-2.5 text-sm text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
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
                className="w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-md px-6 py-2.5 text-sm transition-colors cursor-pointer"
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

function ResetPassword() {
  return (
    <Suspense fallback={<LoadingResetPassword />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

export default ResetPassword;
