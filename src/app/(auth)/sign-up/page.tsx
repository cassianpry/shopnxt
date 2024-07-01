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
    <main className="flex flex-row m-auto items-center justify-center h-screen">
      <div className="container">
        <h1 className="text-slate-700 text-3xl font-bold text-center">
          Criar seu Cadastro
        </h1>

        <p className="text-slate-500 text-lg text-center font-semibold pt-5 ">
          Você vai comprar de forma mais rápida e acompanhar os pedidos feitos
          por você.
        </p>
        <p className="pt-10 text-red-600 text-center">
          *<span className="text-slate-800"> campos obrigatórios</span>
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pt-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-medium">
                    <span className="text-red-600">*</span> Nome completo
                  </FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input
                      className="w-[50%]"
                      type="text"
                      autoComplete="nome"
                      placeholder="Seu nome..."
                      disabled={registerUser.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-600">
                    Entre 3 a 25 caracteres.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-medium">
                    <span className="text-red-600">*</span> E-mail
                  </FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input
                      className="w-[50%]"
                      type="email"
                      placeholder="johndoe@example.com"
                      disabled={registerUser.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-600">
                    Informe um endereço válido de e-mail.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-medium">
                    <span className="text-red-600">*</span> Senha
                  </FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input
                      className="w-[50%]"
                      type="password"
                      autoComplete="password"
                      disabled={registerUser.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-600">
                    Precisa ter entre 5 a 20 caracteres.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-medium">
                    <span className="text-red-600">*</span>Confirmar a senha
                  </FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input
                      className="w-[50%]"
                      type="password"
                      autoComplete="confirm_password"
                      disabled={registerUser.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-600">
                    Confirme sua senha.
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={registerUser.isPending}
              className="bg-blue-900 text-light-850 text-md p-6  hover:bg-blue-600"
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
        <p className="text-center font-semibold pt-8 text-slate-900">
          Já possui cadastro?
          <Link
            href="/sign-in"
            className="text-blue-800 hover:text-blue-600 hover:underline"
          >
            &nbsp;Acesse sua conta
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignUp;
