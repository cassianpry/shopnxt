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
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import ResetPasswordForm from "@/components/form/ResetPasswordForm";

const SignIn = () => {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const callbackURL = searchParams.get("callbackUrl");

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
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      if (result!.error) {
        toast({
          className: "bg-yellow-600 text-light-800",
          title: "Erro ao acessar",
          description:
            "Verifique se os dados estão corretos e tente novamente.",
        });
        setIsSubmitting(false);
      } else {
        toast({
          className: "bg-green-600 text-light-800",
          title: "Acesso efetuado",
          description: "Seu acesso foi efetuado com sucesso!",
        });
        setTimeout(() => {
          router.push(callbackURL ? callbackURL : "/");
          setIsSubmitting(false);
        }, 5000);
      }
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-900 text-light-850 text-md p-6 w-full hover:bg-blue-600"
            >
              {isSubmitting ? (
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
