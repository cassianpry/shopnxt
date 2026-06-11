"use client";
import React, { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { ProfileSchema } from "@/lib/actions/validations";
import { Input } from "@/components/ui/input";
import { MdAutorenew, MdSave } from "react-icons/md";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { UserProps } from "@/types/index.d";
import { useUpdateUser } from "@/app/services/users/mutations";

interface ProfileFormProps {
  user: UserProps;
}

const ProfileForm: FC<ProfileFormProps> = ({ user }) => {
  const { toast } = useToast();
  const { name, email, address, city, phone, state, postalCode, role } = user;
  const updateUser = useUpdateUser();

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
    data._id = user._id;
    try {
      console.log(data);
      updateUser.mutate(data);
    } catch (error) {
      toast({
        className: "bg-red-600 text-white",
        title: "Entre em contato com o suporte",
        description: error + " informe esse erro ao suporte",
      });
    }
  };

  return (
    <div className="flex max-w-[500px] items-center justify-center mx-auto text-text-body">
      <form
        className="flex w-full flex-col items-start justify-start gap-5 mt-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col w-full gap-1">
          <Label>Nome:</Label>
          <Input
            className="input-egs"
            type="text"
            placeholder="John Doe"
            disabled={updateUser.isPending}
            {...register("name")}
          />
          {errors && (
            <span className="error text-red-600">{errors.name?.message}</span>
          )}
        </div>
        <div className="flex flex-col w-full gap-1">
          <Label>E-mail:</Label>
          <Input
            className="input-egs"
            type="email"
            placeholder="john.doe@example.com"
            disabled={updateUser.isPending}
            {...register("email")}
          />
          {errors && (
            <span className="error text-red-600">{errors.email?.message}</span>
          )}
        </div>
        <div className="flex flex-col w-full gap-1">
          <Label>Endereço:</Label>
          <Input
            className="input-egs capitalize"
            type="text"
            placeholder="Av. Paulista, 1234"
            disabled={updateUser.isPending}
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
            className="input-egs"
            type="text"
            placeholder="12345-123"
            disabled={updateUser.isPending}
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
            className="input-egs uppercase"
            type="text"
            placeholder="SP"
            disabled={updateUser.isPending}
            {...register("state")}
          />
          {errors && (
            <span className="error text-red-600">{errors.state?.message}</span>
          )}
        </div>
        <div className="flex flex-col w-full gap-1">
          <Label>Cidade:</Label>
          <Input
            className="input-egs capitalize"
            type="text"
            placeholder="São Paulo"
            disabled={updateUser.isPending}
            {...register("city")}
          />
          {errors && (
            <span className="error text-red-600">{errors.city?.message}</span>
          )}
        </div>
        <div className="flex flex-col w-full gap-1">
          <Label>Telefone:</Label>
          <Input
            className="input-egs"
            type="text"
            placeholder="(11)9123-4567"
            disabled={updateUser.isPending}
            {...register("phone")}
          />
          {errors && (
            <span className="error text-red-600">{errors.phone?.message}</span>
          )}
        </div>

        <Button
          type="submit"
          disabled={updateUser.isPending}
          className="btn-primary text-md p-6 w-full mt-8"
        >
          {updateUser.isPending ? (
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
