"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SignInSchema } from "@/lib/actions/validations";
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
import Link from "next/link";
import { MdAutorenew, MdLogin, MdPersonOutline } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/form/ResetPasswordForm";
import { useLoginUser } from "@/app/services/users/mutations";

const SignIn = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const loginUser = useLoginUser();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    try {
      loginUser.mutate(values);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main className="min-h-screen bg-dark-100 flex items-center justify-center">
      <div className="bg-dark-300 border border-dark-400 rounded-xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="font-spaceGrotesk text-2xl font-bold text-text-high flex items-center justify-center gap-2">
            <MdPersonOutline className="w-7 h-7 text-accent" />
            Acesso do cliente
          </h1>
        </div>

        <p className="text-text-body text-sm text-center mb-6">
          Você vai poder acompanhar as suas compras e realiza-las de forma
          rápida.
        </p>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-body text-sm mb-1 block">
                    <span className="text-red-400">*</span>&nbsp;E-mail
                  </FormLabel>
                  <FormMessage className="text-red-400 text-xs" />
                  <FormControl>
                    <Input
                      className="w-full bg-dark-400 border border-dark-500 rounded-md px-4 py-2.5 text-sm text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      type="email"
                      placeholder="johndoe@example.com"
                      disabled={loginUser.isPending}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex text-text-body text-sm mb-1 justify-between">
                    <div>
                      <span className="text-red-400">*</span>
                      <span>&nbsp;Senha</span>
                    </div>
                    <div
                      className="text-text-muted hover:text-text-high text-sm transition-colors cursor-pointer"
                      onClick={() => setIsOpen(true)}
                    >
                      <span>Esqueceu a senha?</span>
                    </div>
                  </FormLabel>
                  <FormMessage className="text-red-400 text-xs" />
                  <FormControl>
                    <Input
                      className="w-full bg-dark-400 border border-dark-500 rounded-md px-4 py-2.5 text-sm text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      type="password"
                      autoComplete="currentPassword"
                      disabled={loginUser.isPending}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loginUser.isPending}
              className="w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-md px-6 py-2.5 text-sm transition-colors cursor-pointer"
            >
              {loginUser.isPending ? (
                <>
                  <MdAutorenew className="w-5 h-5 mr-2 animate-spin" />
                  <p className="animate-pulse">Acessando...</p>
                </>
              ) : (
                <>
                  <MdLogin className="w-5 h-5 mr-2" />
                  Acessar a sua conta
                </>
              )}
            </Button>
          </form>
        </Form>
        <p className="text-center pt-6 text-text-muted text-sm">
          Não possui cadastro?&nbsp;
          <Link
            href="/sign-up"
            className="text-accent hover:text-text-high transition-colors"
          >
            Crie um rapidamente
          </Link>
        </p>

        <ResetPasswordForm isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </main>
  );
};

export default SignIn;
