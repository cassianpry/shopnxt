"use client";
import { UserOrderSchema } from "@/lib/actions/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FiRefreshCw } from "react-icons/fi";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useCreateOrder } from "@/app/services/orders/mutations";
import { CartContext } from "@/context/CartContext";
import { ProductProps, UserProps } from "@/types/index.d";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { MdAutorenew } from "react-icons/md";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  user: UserProps;
}

function UserCheckoutForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const createOrder = useCreateOrder();
  const { cartProducts, clearCart } = useContext(CartContext);

  const form = useForm<z.infer<typeof UserOrderSchema>>({
    resolver: zodResolver(UserOrderSchema),
    defaultValues: {
      _id: user._id,
      name: user.name || "",
      email: user.email || "",
      address: user.address || "",
      checkAddress: false,
      postalCode: user.postalCode || "",
      phone: user.phone || "",
      city: user.city || "",
      state: user.state || "",
      cardNumber: "",
      expireDate: "",
      cvv: "",
      billingAddress: "",
      billingPostalCode: "",
      billingState: "",
      billingCity: "",
    },
  });

  const checkboxValue = form.watch("checkAddress");

  const calcTotalPrice = (products: ProductProps[]) => {
    let total = 0;
    products?.forEach((product) => {
      total += parseFloat(product.price);
    });
    return total;
  };

  const totalPrice = calcTotalPrice(cartProducts);

  if (totalPrice === 0) {
    router.push("/");
  }

  const onSubmit = async (values: z.infer<typeof UserOrderSchema>) => {
    try {
      createOrder.mutate({ ...values, cartProducts, totalPrice });
    } catch (error) {
      console.log(error);
      toast({
        className: "bg-red-600 text-light-800",
        title: "Erro ao criar",
        description: `Algo deu errado, tente novamente! ${form.formState.errors}`,
      });
    } finally {
      localStorage.removeItem("cart");
      clearCart();
      form.reset();
    }
  };

  // useEffect(() => {
  //   if (user) {
  //     form.reset({
  //       _id: user._id,
  //       name: user.name,
  //       email: user.email,
  //       address: user.address,
  //       checkAddress: false,
  //       postalCode: user.postalCode,
  //       phone: user.phone,
  //       city: user.city,
  //       state: user.state,
  //       cardNumber: undefined,
  //       cvv: undefined,
  //       month: undefined,
  //       year: undefined,
  //     });
  //   } else {
  //     form.reset({
  //       name: "",
  //       email: "",
  //       address: "",
  //       checkAddress: false,
  //       postalCode: "",
  //       phone: "",
  //       city: "",
  //       state: "",
  //       cardNumber: undefined,
  //       cvv: undefined,
  //       month: undefined,
  //       year: undefined,
  //     });
  //   }
  // }, [user, form]);
  return (
    <div className="flex flex-col text-dark400_light700">
      {user ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pt-2"
          >
            <div className="flex justify-between gap-5">
              <div className="flex flex-col w-full max-w-[900px]">
                <div className="flex flex-col">
                  <h1 className="font-bold text-4xl pb-1 text-center lg:text-left">
                    Informações do cliente
                  </h1>
                  <div className="flex gap-4 pb-3">
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormLabel className="text-md font-medium">
                            <span className="text-red-600">*</span>&nbsp;Nome
                          </FormLabel>

                          <FormControl>
                            <Input
                              disabled={createOrder.isPending === true}
                              className="background-light800_dark300"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    {/* E-mail */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-[35%]">
                          <FormLabel className="text-md font-medium ">
                            <span className="text-red-600">*</span>&nbsp;E-mail
                          </FormLabel>

                          <FormControl>
                            <Input
                              disabled={createOrder.isPending === true}
                              className="background-light800_dark300"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-4 pb-3">
                    {/* Address */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="grow">
                          <FormLabel className="text-md font-medium ">
                            <span className="text-red-600">*</span>
                            &nbsp;Endereço
                          </FormLabel>

                          <FormControl>
                            <Input
                              disabled={createOrder.isPending === true}
                              className="background-light800_dark300 capitalize"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    {/* CEP */}
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel className="text-md font-medium ">
                            <span className="text-red-600">*</span>&nbsp;CEP
                          </FormLabel>

                          <FormControl>
                            <Input
                              disabled={createOrder.isPending === true}
                              className="background-light800_dark300 w-24 text-center"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    {/* State */}
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel className="text-md font-medium ">
                            <span className="text-red-600">*</span>&nbsp;UF
                          </FormLabel>

                          <FormControl>
                            <Input
                              disabled={createOrder.isPending === true}
                              className="background-light800_dark300 w-14 uppercase text-center"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-4 pb-3">
                    {/* City */}
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel className="text-md font-medium ">
                            <span className="text-red-600">*</span>&nbsp;Cidade
                          </FormLabel>

                          <FormControl>
                            <Input
                              disabled={createOrder.isPending === true}
                              className="background-light800_dark300 w-56 capitalize"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel className="text-md font-medium ">
                            <span className="text-red-600">*</span>
                            &nbsp;Telefone
                          </FormLabel>

                          <FormControl>
                            <Input
                              disabled={createOrder.isPending === true}
                              className="background-light800_dark300 w-32 text-center"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-3">
                  <h1 className="font-bold text-4xl pb-2 text-center lg:text-left">
                    Informações de pagamento
                  </h1>
                  <p className="font-normal text-xl dark:text-gray-400 pb-2">
                    Exatamente como esta no seu cartão de crédito
                  </p>

                  <div className="flex gap-4">
                    {/* Card Number */}
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel className="text-md font-medium">
                            <span className="text-red-600">*</span>&nbsp;Nº do
                            Cartão de crédito
                          </FormLabel>

                          <FormControl>
                            <Input
                              disabled={createOrder.isPending === true}
                              className="background-light800_dark300 text-center"
                              type="text"
                              {...field}
                              placeholder="ex:1234567891011121"
                              maxLength={16}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    {/* Expire Date */}
                    <FormField
                      control={form.control}
                      name="expireDate"
                      render={({ field }) => (
                        <FormItem className="w-20">
                          <FormLabel className="text-md font-medium">
                            <span className="text-red-600">*</span>
                            &nbsp;Expiração
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={createOrder.isPending === true}
                              className="background-light800_dark300 text-center"
                              type="text"
                              {...field}
                              placeholder="06/24"
                              maxLength={5}
                              minLength={5}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                    {/* Year
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem className="w-16">
                          <FormLabel className="text-md font-medium ">
                            <span className="text-red-600">*</span>&nbsp;Ano
                          </FormLabel>

                          <FormControl>
                            <Input
                            disabled={createOrder.isPending===true}
                              className="background-light800_dark300 text-center"
                              type="text"
                              {...field}
                              maxLength={2}
                              minLength={2}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    /> */}
                    {/* CVV */}
                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem className="w-16">
                          <FormLabel className="text-md font-medium ">
                            <span className="text-red-600">*</span>&nbsp;CVV
                          </FormLabel>

                          <FormControl>
                            <Input
                              disabled={createOrder.isPending === true}
                              className="background-light800_dark300 text-center"
                              type="text"
                              {...field}
                              maxLength={3}
                              minLength={3}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="font-bold text-4xl mt-5 text-center lg:text-left">
                    Informações de cobrança
                  </h1>

                  <FormField
                    control={form.control}
                    name="checkAddress"
                    render={({ field }) => (
                      <FormItem className="flex py-3">
                        <FormControl>
                          <Checkbox
                            checked={checkboxValue}
                            onCheckedChange={(event) => {
                              const fieldIsChecked =
                                typeof event === "boolean"
                                  ? event
                                  : //@ts-ignore
                                    event.target.checked;
                              field.onChange(fieldIsChecked);

                              form.setValue(
                                "billingAddress",
                                fieldIsChecked ? user.address : ""
                              );

                              form.setValue(
                                "billingPostalCode",
                                fieldIsChecked ? user.postalCode : ""
                              );

                              form.setValue(
                                "billingState",
                                fieldIsChecked ? user.state : ""
                              );
                              form.setValue(
                                "billingCity",
                                fieldIsChecked ? user.city : ""
                              );
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none pl-2">
                          <FormLabel>
                            Endereço de cobrança é o mesmo do cadastro
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4 pb-3">
                    {/* Billing Address */}
                    {checkboxValue === true ? (
                      <FormItem className="grow">
                        <FormLabel className="text-md font-medium ">
                          <span className="text-red-600">*</span>
                          &nbsp;Endereço
                        </FormLabel>
                        <Input
                          className="background-light800_dark300 capitalize"
                          type="text"
                          {...form.register("billingAddress")}
                          disabled={
                            checkboxValue || createOrder.isPending === true
                          }
                        />
                      </FormItem>
                    ) : (
                      <FormField
                        control={form.control}
                        name="billingAddress"
                        render={({ field }) => (
                          <FormItem className="grow">
                            <FormLabel className="text-md font-medium ">
                              <span className="text-red-600">*</span>
                              &nbsp;Endereço
                            </FormLabel>

                            <FormControl>
                              <Input
                                className="background-light800_dark300 capitalize"
                                type="text"
                                {...field}
                                disabled={
                                  checkboxValue ||
                                  createOrder.isPending === true
                                }
                              />
                            </FormControl>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Billing Zip */}
                    {checkboxValue === true ? (
                      <FormItem className="">
                        <FormLabel className="text-md font-medium ">
                          <span className="text-red-600">*</span>&nbsp;CEP
                        </FormLabel>

                        <Input
                          className="background-light800_dark300 w-24 text-center"
                          type="text"
                          disabled={
                            checkboxValue || createOrder.isPending === true
                          }
                          {...form.register("billingPostalCode")}
                        />
                      </FormItem>
                    ) : (
                      <FormField
                        control={form.control}
                        name="billingPostalCode"
                        render={({ field }) => (
                          <FormItem className="">
                            <FormLabel className="text-md font-medium ">
                              <span className="text-red-600">*</span>&nbsp;CEP
                            </FormLabel>

                            <FormControl>
                              <Input
                                className="background-light800_dark300 w-24 text-center"
                                type="text"
                                disabled={
                                  checkboxValue ||
                                  createOrder.isPending === true
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Billing State */}
                    {checkboxValue === true ? (
                      <FormItem className="">
                        <FormLabel className="text-md font-medium ">
                          <span className="text-red-600">*</span>&nbsp;UF
                        </FormLabel>

                        <Input
                          className="background-light800_dark300 w-14 uppercase text-center"
                          type="text"
                          disabled={
                            checkboxValue || createOrder.isPending === true
                          }
                          {...form.register("billingState")}
                        />
                      </FormItem>
                    ) : (
                      <FormField
                        control={form.control}
                        name="billingState"
                        render={({ field }) => (
                          <FormItem className="">
                            <FormLabel className="text-md font-medium ">
                              <span className="text-red-600">*</span>&nbsp;UF
                            </FormLabel>

                            <FormControl>
                              <Input
                                className="background-light800_dark300 w-14 uppercase text-center"
                                type="text"
                                disabled={
                                  checkboxValue ||
                                  createOrder.isPending === true
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <div className="flex gap-4 pb-3">
                    {/* Billing City */}
                    {checkboxValue === true ? (
                      <FormItem className="">
                        <FormLabel className="text-md font-medium ">
                          <span className="text-red-600">*</span>&nbsp;Cidade
                        </FormLabel>

                        <Input
                          className="background-light800_dark300 w-56 capitalize"
                          type="text"
                          disabled={
                            checkboxValue || createOrder.isPending === true
                          }
                          {...form.register("billingCity")}
                        />
                      </FormItem>
                    ) : (
                      <FormField
                        control={form.control}
                        name="billingCity"
                        render={({ field }) => (
                          <FormItem className="">
                            <FormLabel className="text-md font-medium ">
                              <span className="text-red-600">*</span>
                              &nbsp;Cidade
                            </FormLabel>

                            <FormControl>
                              <Input
                                className="background-light800_dark300 w-56 capitalize"
                                type="text"
                                disabled={
                                  checkboxValue ||
                                  createOrder.isPending === true
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start max-w-[600px] ">
                {createOrder.isPending === true ? (
                  ""
                ) : (
                  <div className="border border-gray-700 dark:border-gray-400 rounded-md">
                    <h2 className="h2-bold text-xl m-3">Resumo da compra:</h2>
                    <Separator
                      orientation="horizontal"
                      className="bg-gray-600 dark:bg-gray-400"
                    />
                    <div className="flex flex-col gap-3 m-3 justify-between items center text-sm font-semibold">
                      {cartProducts.map((product) => (
                        <div
                          key={product._id}
                          className="flex gap-3 items-center"
                        >
                          <Image
                            className="max-w-24 max-h-12"
                            src={product.productImage}
                            width={150}
                            height={150}
                            alt={product.name}
                          />
                          <div className="flex flex-col justify-start">
                            <span>{product.name}</span>
                            <span>
                              {parseFloat(product.price).toLocaleString(
                                "pt-BR",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator
                      orientation="horizontal"
                      className="bg-gray-600 dark:bg-gray-400"
                    />
                    <h3 className="m-3 base-semibold">
                      Total:&nbsp;
                      {totalPrice.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </h3>
                  </div>
                )}

                <Button
                  type="submit"
                  className="mt-3 flex w-full items-center justify-center rounded-md font-semibold text-xs text-light-900  bg-blue-900 hover:bg-blue-600 transition-all duration-300 ease-in-out uppercase"
                  disabled={createOrder.isPending === true}
                >
                  {createOrder.isPending === true ? (
                    <>
                      <MdAutorenew className="w-5 h-5 mr-2 animate-spin" />
                      <p className="animate-pulse">Processando...</p>
                    </>
                  ) : (
                    "Finalizar a compra"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      ) : (
        <FiRefreshCw className="h-5 w-5 animate-spin" />
      )}
    </div>
  );
}

export default UserCheckoutForm;
