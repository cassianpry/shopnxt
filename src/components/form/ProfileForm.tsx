"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { ProfileSchema } from "@/lib/actions/validations";
import { Input } from "@/components/ui/input";
import { MdAutorenew, MdSave } from "react-icons/md";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import Image from "next/image";
import { UserProps } from "@/types/index.d";

interface ProfileFormProps {
  user: UserProps;
}

const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { name, email, address, city, phone, state, postalCode, role } = user;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: name,
      email: email,
      address: address,
      postalCode: postalCode,
      phone: phone,
      city: city,
      state: state,
      role: role,
    },
  });

  const onSubmit = async (data: UserProps) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user._id}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        setIsSubmitting(false);
        toast({
          className: "bg-yellow-600 text-light-800",
          title: "Erro ao cadastrar",
          description: "Algo de errado ao criar a sua conta. Tente novamente.",
        });
      } else {
        toast({
          className: "bg-green-600 text-light-800",
          title: "Usuário alterado",
          description: "Seu usuário foi alterado com sucesso!",
        });

        setIsSubmitting(false);
        // router.push(`/`);
      }
    } catch (error) {
      setIsSubmitting(false);
      toast({
        className: "bg-red-600 text-light-800",
        title: "Entre em contato com o suporte",
        description: error + " informe esse erro ao suporte",
      });
    }
  };
  console.log("ERROS=>", errors);
  return (
    <div className="flex max-w-[500px] items-center justify-center mx-auto text-dark400_light900">
      <form
        className="flex w-full flex-col items-start justify-start gap-5 mt-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col w-full gap-1">
          <Label>Nome:</Label>
          <Input
            className="background-light800_dark300"
            type="text"
            placeholder="John Doe"
            {...register("name")}
          />
          {errors && (
            <span className="error text-red-600">{errors.name?.message}</span>
          )}
        </div>
        <div className="flex flex-col w-full gap-1">
          <Label>E-mail:</Label>
          <Input
            className="background-light800_dark300"
            type="email"
            placeholder="john.doe@example.com"
            {...register("email")}
          />
          {errors && (
            <span className="error text-red-600">{errors.email?.message}</span>
          )}
        </div>
        <div className="flex flex-col w-full gap-1">
          <Label>Endereço:</Label>
          <Input
            className="background-light800_dark300 capitalize"
            type="text"
            placeholder="Av. Paulista, 1234"
            {...register("address")}
          />
          {errors && (
            <span className="error text-red-600">
              {errors.address?.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-full gap-1">
          <Label>CEP:</Label>
          <Input
            className="background-light800_dark300"
            type="text"
            placeholder="12345-123"
            {...register("postalCode")}
          />
          {errors && (
            <span className="error text-red-600">
              {errors.postalCode?.message}
            </span>
          )}
        </div>
        <div className="flex flex-col w-full gap-1">
          <Label>Estado:</Label>
          <Input
            className="background-light800_dark300 uppercase"
            type="text"
            placeholder="SP"
            {...register("state")}
          />
          {errors && (
            <span className="error text-red-600">{errors.state?.message}</span>
          )}
        </div>
        <div className="flex flex-col w-full gap-1">
          <Label>Cidade:</Label>
          <Input
            className="background-light800_dark300 capitalize"
            type="text"
            placeholder="São Paulo"
            {...register("city")}
          />
          {errors && (
            <span className="error text-red-600">{errors.city?.message}</span>
          )}
        </div>
        <div className="flex flex-col w-full gap-1">
          <Label>Telefone:</Label>
          <Input
            className="background-light800_dark300"
            type="text"
            placeholder="(11)9123-4567"
            {...register("phone")}
          />
          {errors && (
            <span className="error text-red-600">{errors.phone?.message}</span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-900 text-light-850 text-md p-6 w-full hover:bg-blue-600 mt-8"
        >
          {isSubmitting ? (
            <>
              <MdAutorenew className="w-5 h-5 mr-2 animate-spin" />
              <p className="animate-pulse">Alterando seu perfil...</p>
            </>
          ) : (
            <>
              <MdSave className="w-5 h-5 mr-2" />
              Salvar
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
