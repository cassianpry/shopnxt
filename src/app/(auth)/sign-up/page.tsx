"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SignUpSchema } from "@/lib/actions/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { MdAutorenew, MdLogin } from "react-icons/md";
import { useToast } from "@/components/ui/use-toast";
import { useRegisterUser } from "@/app/services/users/mutations";

const SignUp = () => {
  const { toast } = useToast();
  const registerUser = useRegisterUser();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    try {
      registerUser.mutate(values);
    } catch (error) {
      toast({
        className: "bg-red-600 text-light-800",
        title: "Entre em contato com o suporte",
        description: error + " informe esse erro ao suporte",
      });
    }
  };
  return (
    <main className="min-h-screen bg-dark-100 flex items-center justify-center">
      <div className="bg-dark-300 border border-dark-400 rounded-xl p-8 w-full max-w-md mx-4">
        <h1 className="font-spaceGrotesk text-2xl font-bold text-text-high text-center mb-2">
          Criar seu Cadastro
        </h1>

        <p className="text-text-body text-sm text-center mb-6">
          Você vai comprar de forma mais rápida e acompanhar os pedidos feitos
          por você.
        </p>
        <p className="mb-6 text-red-400 text-xs text-center">
          *<span className="text-text-body"> campos obrigatórios</span>
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-body text-sm mb-1 block">
                    <span className="text-red-400">*</span> Nome completo
                  </FormLabel>
                  <FormMessage className="text-red-400 text-xs" />
                  <FormControl>
                    <Input
                      className="w-full bg-dark-400 border border-dark-500 rounded-md px-4 py-2.5 text-sm text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      type="text"
                      autoComplete="nome"
                      placeholder="Seu nome..."
                      disabled={registerUser.isPending}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-text-muted text-xs mt-1">
                    Entre 3 a 25 caracteres.
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-body text-sm mb-1 block">
                    <span className="text-red-400">*</span> E-mail
                  </FormLabel>
                  <FormMessage className="text-red-400 text-xs" />
                  <FormControl>
                    <Input
                      className="w-full bg-dark-400 border border-dark-500 rounded-md px-4 py-2.5 text-sm text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      type="email"
                      placeholder="johndoe@example.com"
                      disabled={registerUser.isPending}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-text-muted text-xs mt-1">
                    Informe um endereço válido de e-mail.
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-body text-sm mb-1 block">
                    <span className="text-red-400">*</span> Senha
                  </FormLabel>
                  <FormMessage className="text-red-400 text-xs" />
                  <FormControl>
                    <Input
                      className="w-full bg-dark-400 border border-dark-500 rounded-md px-4 py-2.5 text-sm text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      type="password"
                      autoComplete="password"
                      disabled={registerUser.isPending}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-text-muted text-xs mt-1">
                    Precisa ter entre 5 a 20 caracteres.
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-body text-sm mb-1 block">
                    <span className="text-red-400">*</span>Confirmar a senha
                  </FormLabel>
                  <FormMessage className="text-red-400 text-xs" />
                  <FormControl>
                    <Input
                      className="w-full bg-dark-400 border border-dark-500 rounded-md px-4 py-2.5 text-sm text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      type="password"
                      autoComplete="confirm_password"
                      disabled={registerUser.isPending}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-text-muted text-xs mt-1">
                    Confirme sua senha.
                  </p>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={registerUser.isPending}
              className="w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-md px-6 py-2.5 text-sm transition-colors cursor-pointer"
            >
              {registerUser.isPending ? (
                <>
                  <MdAutorenew className="w-5 h-5 mr-2 animate-spin" />
                  <p className="animate-pulse">Criando o cadastro...</p>
                </>
              ) : (
                <>
                  <MdLogin className="w-5 h-5 mr-2" />
                  Criar cadastro
                </>
              )}
            </Button>
          </form>
        </Form>
        <p className="text-center pt-6 text-text-muted text-sm">
          Já possui cadastro?
          <Link
            href="/sign-in"
            className="text-accent hover:text-text-high transition-colors"
          >
            &nbsp;Acesse sua conta
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignUp;
