import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

import { Input } from "../ui/input";
import { FormUserProps } from "@/types/index.d";
import { FiRefreshCw } from "react-icons/fi";
import { MdCancel, MdSave } from "react-icons/md";
import { ProfileSchema } from "@/lib/actions/validations";
import { toast } from "../ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Skeleton } from "../ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUpdateUser } from "@/app/services/users/mutations";

function UserForm({ isOpen, setIsOpen, user }: FormUserProps) {
  const updateUser = useUpdateUser();
  //const createUser = useCreateUser();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
  });

  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    if (values._id !== undefined) {
      try {
        updateUser.mutate({ ...values });
        form.reset();
        setIsOpen!(false);
      } catch (error) {
        console.log(error);
        toast({
          className: "bg-red-600 text-white",
          title: "Erro ao criar",
          description: `Algo deu errado, tente novamente! ${error}`,
        });
      }
    } else {
      try {
        // createUser.mutate(values);
        console.log(values);
        //form.reset();
        //setIsOpen(false);
      } catch (error) {
        console.log(error);
        toast({
          className: "bg-red-600 text-white",
          title: "Erro ao criar",
          description: `Algo deu errado, tente novamente! ${error}`,
        });
      }
    }
  };

  useEffect(() => {
    if (user!.data) {
      form.reset({
        _id: user!.data._id,
        name: user!.data.name,
        email: user!.data.email,
        address: user!.data.address,
        postalCode: user!.data.postalCode,
        phone: user!.data.phone,
        city: user!.data.city,
        state: user!.data.state,
        role: user!.data.role,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        address: "",
        postalCode: "",
        phone: "",
        city: "",
        state: "",
        role: "",
      });
    }
  }, [user, form.setValue, form]);

  const roles = [
    {
      value: "admin",
      name: "admin",
    },
    {
      value: "user",
      name: "user",
    },
  ];

  if (user!.isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen!(false);
        form.reset();
      }}
    >
      <DialogContent className="flex flex-col items-center bg-dark-300 text-text-body">
        <DialogHeader>
          <DialogTitle className="text-text-high text-2xl font-semibold">
            {user?.data ? "Alterar usuário" : "Cadastrar usuário"}
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            {user?.data
              ? "Faça alterações no usuário."
              : "Cadastre um novo usuário"}
          </DialogDescription>
        </DialogHeader>
        <p className="mt-5 text-red-600">
          *
          <span className="text-text-body">
            &nbsp;todos os campos são obrigatórios
          </span>
        </p>
        <div className="grid gap-4 items-center">
          {user ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 pt-2 text-text-body"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-md font-medium text-text-body">
                        <span className="text-red-600">*</span>&nbsp;Nome
                      </FormLabel>
                      <FormMessage className="text-red-600" />
                      <FormControl>
                        <Input
                          className="input-egs"
                          type="text"
                          disabled={user.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-text-muted">
                        Entre 3 a 50 caracteres.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                {/* E-mail */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-md font-medium text-text-body">
                        <span className="text-red-600">*</span>&nbsp;E-mail
                      </FormLabel>
                      <FormMessage className="text-red-600" />
                      <FormControl>
                        <Input
                          className="input-egs"
                          type="email"
                          disabled={user.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-text-muted"></FormDescription>
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-md font-medium text-text-body">
                        <span className="text-red-600">*</span>&nbsp;Endereço
                      </FormLabel>
                      <FormMessage className="text-red-600" />
                      <FormControl>
                        <Input
                          className="input-egs"
                          type="text"
                          disabled={user.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-text-muted"></FormDescription>
                    </FormItem>
                  )}
                />
                <div className="flex justify-between gap-1">
                  {/* CEP */}
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="text-md font-medium text-text-body">
                          <span className="text-red-600">*</span>&nbsp;CEP
                        </FormLabel>
                        <FormMessage className="text-red-600" />
                        <FormControl>
                          <Input
                            className="input-egs w-24"
                            type="text"
                            disabled={user.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-text-muted"></FormDescription>
                      </FormItem>
                    )}
                  />
                  {/* State */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="text-md font-medium text-text-body">
                          <span className="text-red-600">*</span>&nbsp;UF
                        </FormLabel>
                        <FormMessage className="text-red-600" />
                        <FormControl>
                          <Input
                            className="input-egs w-14"
                            type="text"
                            disabled={user.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-text-muted"></FormDescription>
                      </FormItem>
                    )}
                  />
                  {/* City */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="text-md font-medium text-text-body">
                          <span className="text-red-600">*</span>&nbsp;Cidade
                        </FormLabel>
                        <FormMessage className="text-red-600" />
                        <FormControl>
                          <Input
                            className="input-egs w-56"
                            type="text"
                            disabled={user.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-text-muted"></FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="text-md font-medium text-text-body">
                        <span className="text-red-600">*</span>&nbsp;Telefone
                      </FormLabel>
                      <FormMessage className="text-red-600" />
                      <FormControl>
                        <Input
                          className="input-egs w-32"
                          type="text"
                          disabled={user.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-text-muted"></FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-text-body">Função</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="input-egs">
                          <SelectValue
                            className="text-text-body"
                            placeholder="Selecione a função"
                          />
                        </SelectTrigger>

                        <SelectContent className="bg-dark-300 border border-dark-400 text-text-body">
                          {roles.map((r) => (
                            <SelectItem
                              key={r.name}
                              className="hover:bg-dark-400 focus:bg-dark-400"
                              value={r.value}
                            >
                              {r.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-center gap-2">
                  <Button
                    type="submit"
                    disabled={user.isPending}
                    className="btn-primary w-[200px] py-3"
                  >
                    {user.isPending === true ? (
                      <>
                        <FiRefreshCw className="h-5 w-5 animate-spin" />
                        <span className="ml-2">
                          {user?.data ? "Alterando..." : "Cadastrando..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <MdSave className="h-5 w-5" />
                        <span className="ml-2">
                          {user?.data ? "Alterar" : "Cadastrar"}
                        </span>
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    disabled={user.isPending}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-md px-4 py-2 text-sm"
                    onClick={() => form.reset()}
                  >
                    <MdCancel className="h-5 w-5" />
                    <span className="ml-2">Cancelar</span>
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <FiRefreshCw className="h-5 w-5 animate-spin" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserForm;
