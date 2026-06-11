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
        className: "bg-red-600 text-white",
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
    <div className="text-text-body">
      {user ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pt-2"
          >
            <div className="lg:flex gap-8">
              <div className="flex-1">
                <div className="bg-dark-300 rounded-xl p-6">
                  <div className="flex flex-col">
                    <h1 className="text-text-high font-spaceGrotesk font-bold text-2xl mb-6">
                      Informações do cliente
                    </h1>
                    <div className="flex gap-4 pb-3">
                      {/* Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormLabel className="text-text-body text-sm">
                              <span className="text-red-600">*</span>&nbsp;Nome
                            </FormLabel>

                            <FormControl>
                              <Input
                                disabled={createOrder.isPending === true}
                                className="input-egs"
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
                            <FormLabel className="text-text-body text-sm">
                              <span className="text-red-600">*</span>&nbsp;E-mail
                            </FormLabel>

                            <FormControl>
                              <Input
                                disabled={createOrder.isPending === true}
                                className="input-egs"
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
                            <FormLabel className="text-text-body text-sm">
                              <span className="text-red-600">*</span>
                              &nbsp;Endereço
                            </FormLabel>

                            <FormControl>
                              <Input
                                disabled={createOrder.isPending === true}
                                className="input-egs capitalize"
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
                            <FormLabel className="text-text-body text-sm">
                              <span className="text-red-600">*</span>&nbsp;CEP
                            </FormLabel>

                            <FormControl>
                              <Input
                                disabled={createOrder.isPending === true}
                                className="input-egs w-24 text-center"
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
                            <FormLabel className="text-text-body text-sm">
                              <span className="text-red-600">*</span>&nbsp;UF
                            </FormLabel>

                            <FormControl>
                              <Input
                                disabled={createOrder.isPending === true}
                                className="input-egs w-14 uppercase text-center"
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
                            <FormLabel className="text-text-body text-sm">
                              <span className="text-red-600">*</span>&nbsp;Cidade
                            </FormLabel>

                            <FormControl>
                              <Input
                                disabled={createOrder.isPending === true}
                                className="input-egs w-56 capitalize"
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
                            <FormLabel className="text-text-body text-sm">
                              <span className="text-red-600">*</span>
                              &nbsp;Telefone
                            </FormLabel>

                            <FormControl>
                              <Input
                                disabled={createOrder.isPending === true}
                                className="input-egs w-32 text-center"
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
                  <div className="flex flex-col mt-8">
                    <h1 className="text-text-high font-spaceGrotesk font-bold text-2xl mb-4">
                      Informações de pagamento
                    </h1>
                    <p className="text-text-muted text-base pb-2">
                      Integração com provedor de pagamento em breve.
                    </p>
                  </div>
                  <div className="flex flex-col mt-8">
                    <h1 className="text-text-high font-spaceGrotesk font-bold text-2xl mb-4">
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
                            <FormLabel className="text-text-body text-sm">
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
                          <FormLabel className="text-text-body text-sm">
                            <span className="text-red-600">*</span>
                            &nbsp;Endereço
                          </FormLabel>
                          <Input
                            className="input-egs capitalize"
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
                              <FormLabel className="text-text-body text-sm">
                                <span className="text-red-600">*</span>
                                &nbsp;Endereço
                              </FormLabel>

                              <FormControl>
                                <Input
                                  className="input-egs capitalize"
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
                          <FormLabel className="text-text-body text-sm">
                            <span className="text-red-600">*</span>&nbsp;CEP
                          </FormLabel>

                          <Input
                            className="input-egs w-24 text-center"
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
                              <FormLabel className="text-text-body text-sm">
                                <span className="text-red-600">*</span>&nbsp;CEP
                              </FormLabel>

                              <FormControl>
                                <Input
                                  className="input-egs w-24 text-center"
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
                          <FormLabel className="text-text-body text-sm">
                            <span className="text-red-600">*</span>&nbsp;UF
                          </FormLabel>

                          <Input
                            className="input-egs w-14 uppercase text-center"
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
                              <FormLabel className="text-text-body text-sm">
                                <span className="text-red-600">*</span>&nbsp;UF
                              </FormLabel>

                              <FormControl>
                                <Input
                                  className="input-egs w-14 uppercase text-center"
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
                          <FormLabel className="text-text-body text-sm">
                            <span className="text-red-600">*</span>&nbsp;Cidade
                          </FormLabel>

                          <Input
                            className="input-egs w-56 capitalize"
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
                              <FormLabel className="text-text-body text-sm">
                                <span className="text-red-600">*</span>
                                &nbsp;Cidade
                              </FormLabel>

                              <FormControl>
                                <Input
                                  className="input-egs w-56 capitalize"
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
              </div>
              <div className="w-full lg:w-[420px] mt-8 lg:mt-0">
                <div className="bg-dark-300 rounded-xl p-6 sticky top-24">
                  {createOrder.isPending === true ? (
                    ""
                  ) : (
                    <>
                      <h2 className="text-text-high text-lg font-bold font-spaceGrotesk mb-4">
                        Resumo da compra:
                      </h2>
                      <Separator
                        orientation="horizontal"
                        className="bg-dark-500"
                      />
                      <div className="flex flex-col gap-3 my-3 justify-between items center text-sm font-semibold">
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
                              <span className="text-text-high">{product.name}</span>
                              <span className="text-text-body">
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
                        className="bg-dark-500"
                      />
                      <h3 className="text-text-high text-base font-semibold mt-3">
                        Total:&nbsp;
                        {totalPrice.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </h3>
                    </>
                  )}

                  <Button
                    type="submit"
                    className="bg-accent hover:bg-accent-hover text-white font-bold w-full rounded-md py-3 text-sm transition-colors mt-6"
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
