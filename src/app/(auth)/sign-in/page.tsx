"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FiLogIn, FiRefreshCw } from "react-icons/fi";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { SignInSchema } from "@/src/lib/validations";
import { Input } from "@/src/components/ui/input";
import toast from "react-hot-toast";
import Link from "next/link";
import { signIn } from "next-auth/react";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackURL = searchParams.get("callbackUrl") || "/";
  console.log(callbackURL);

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        toast.error(result?.error);
        setIsSubmitting(false);
      }

      toast.success("Usuário logado com sucesso!!");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      router.push(callbackURL);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex card-wrapper max-w-screen-xl flex-1 justify-center bg-light-900 shadow sm:rounded-[10px]  ">
          <div className="flex-1 bg-blue-900 text-center hidden lg:flex rounded-tl-md rounded-bl-md">
            <Image
              className="rounded-tl-md rounded-bl-md"
              src="/assets/images/login.svg"
              alt="Sign up"
              width={800}
              height={800}
            />
          </div>
          <div className="p-6 sm:p-12 lg:w-1/2 xl:w-5/12">
            <div className=" flex flex-col items-center">
              <div className="text-center">
                <h1 className="text-2xl font-extrabold text-blue-900 xl:text-4xl">
                  Acesse a sua conta
                </h1>
                <p className="text-[12px] text-gray-500">
                  Preencha com os seus dados para acessar a sua conta
                </p>
              </div>
              <div className="mt-8 w-full flex-1">
                <div className="mx-auto flex max-w-xs flex-col gap-4">
                  {/* E-mail */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="paragraph-semibold text-dark-500">
                          Seu E-mail:&#160;
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john.doe@contoso.com"
                            className="no-focus focus:bg-white paragraph-regular border border-gray-200 bg-gray-100 text-dark400_light500
                           min-h-[56px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="paragraph-semibold text-dark-500">
                          Senha:&#160;
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Senha de acesso"
                            className="no-focus focus:bg-white paragraph-regular border border-gray-200 bg-gray-100 text-dark400_light500
                           min-h-[56px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="focus:shadow-outline mt-5 flex w-full items-center justify-center rounded-lg bg-blue-900 py-7 font-semibold text-lg tracking-wide text-light-900 transition-all duration-300 ease-in-out hover:bg-blue-600 focus:outline-none"
                  >
                    {isSubmitting === true ? (
                      <FiRefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <FiLogIn className="h-5 w-5" />
                    )}

                    <span className="ml-3">Acessar</span>
                  </Button>
                  <p className="mt-6 text-center text-xs text-dark500_light700">
                    Não possui uma conta?
                    <Link href="/sign-up">
                      <span className="font-semibold text-blue-600">
                        &#160;Cadastrar uma conta
                      </span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SignIn;
