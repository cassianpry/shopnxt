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
import { useRouter, useSearchParams } from "next/navigation";
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
    <main className="flex flex-row mx-auto items-center justify-center h-screen w-1/3 max-xl:w-1/2">
      <div className="container">
        <h1 className="flex items-center text-center text-slate-700 text-3xl font-bold justify-center dark:text-light-900">
          <MdPersonOutline className="w-9 h-9" />
          Acesso do cliente
        </h1>

        <p className="text-slate-500 text-lg text-center font-semibold pt-5 ">
          Você vai poder acompanhar as suas compras e realiza-las de forma
          rápida.
        </p>
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
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="flex text-md font-medium text-left">
                    <span className="text-red-600 ">*</span>&nbsp;E-mail
                  </FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input
                      className="w-[100%] dark:text-dark-500 font-semibold"
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
                <FormItem className="w-full">
                  <FormLabel className="flex text-start justify-between text-md font-medium">
                    <div>
                      <span className="text-red-600">*</span>
                      <span>&nbsp;Senha</span>
                    </div>
                    <div
                      className="body-regular hover:text-blue-600 hover:cursor-pointer"
                      onClick={() => setIsOpen(true)}
                    >
                      <span>Esqueceu a senha?</span>
                    </div>
                  </FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input
                      className="w-[100%] dark:text-dark-500 font-semibold focus:ring-0 focus:ring-offset-0"
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
              className="bg-blue-900 text-light-850 text-md p-6 w-full hover:bg-blue-600"
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
        <p className="text-center font-semibold pt-8 text-slate-900 dark:text-light-900">
          Não possui cadastro?&nbsp;
          <Link
            href="/sign-up"
            className="text-blue-800 hover:text-blue-600 hover:underline"
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
