"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FiRefreshCw, FiUserPlus } from "react-icons/fi";
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
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { SignUpSchema } from "@/src/lib/validations";
import { Input } from "@/src/components/ui/input";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    setIsSubmitting(true);

    try {
      await axios
        .post(`${process.env.API}/register`, {
          name: values.name,
          username: values.username,
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          toast.success("Usuário cadastrado com sucesso!!");
        })
        .catch((error) => {
          toast.error(error.response.data.error, { duration: 4000 });
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      router.push("/redirect");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex card-wrapper max-w-screen-xl flex-1 justify-center bg-light-900 shadow sm:rounded-[10px]  ">
          <div className="flex-1 bg-blue-900 text-center hidden lg:flex rounded-tl-md rounded-bl-md">
            <Image
              className="rounded-[10px]"
              src="/assets/images/marketing.svg"
              alt="Sign up"
              width={800}
              height={800}
            />
          </div>
          <div className="p-6 sm:p-12 lg:w-1/2 xl:w-5/12">
            <div className=" flex flex-col items-center">
              <div className="text-center">
                <h1 className="text-2xl font-extrabold text-blue-900 xl:text-4xl">
                  Cadastro de Usuário
                </h1>
                <p className="text-[12px] text-gray-500">
                  Preencha com os seus dados para criar a sua conta
                </p>
              </div>
              <div className="mt-8 w-full flex-1">
                <div className="mx-auto flex max-w-xs flex-col gap-4">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="paragraph-semibold text-dark-500">
                          Nome:&#160;<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Seu nome..."
                            className="no-focus focus:bg-white paragraph-regular border border-gray-200 bg-gray-100 text-dark400_light500
                           min-h-[56px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  {/* UserName */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="paragraph-semibold text-dark-500">
                          Nome de usuário:&#160;
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Um apelido"
                            className="no-focus focus:bg-white paragraph-regular border border-gray-200 bg-gray-100 text-dark400_light500
                           min-h-[56px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
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
                  {/* Confirm Password */}
                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="paragraph-semibold text-dark-500">
                          Confirme a senha:&#160;
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder=""
                            className="paragraph-regular border border-gray-200 bg-gray-100 text-dark400_light500
                           min-h-[56px] no-focus focus:bg-white"
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
                      <FiUserPlus className="h-5 w-5" />
                    )}

                    <span className="ml-3">Cadastrar</span>
                  </Button>
                  <p className="mt-6 text-center text-xs text-dark500_light700">
                    Já possui uma conta?
                    <Link href="/sign-in">
                      <span className="font-semibold text-blue-600">
                        &#160;Acessar
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

export default SignUp;
