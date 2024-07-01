import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { GenreFormSchema } from "@/lib/actions/validations";
import { toast } from "../ui/use-toast";
import { MdSave } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";
import { useCreateGenre } from "@/app/services/genres/mutations";

interface FormValues {
  _id?: string;
  name: string;
}

interface NewGenreFormProps {
  setIsNew: React.Dispatch<React.SetStateAction<boolean>>;
  isNew: boolean;
}

function NewGenreForm({ isNew, setIsNew }: NewGenreFormProps) {
  const createNewGenre = useCreateGenre();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(GenreFormSchema),
    defaultValues: {
      _id: "",
      name: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (
    values: z.infer<typeof GenreFormSchema>
  ) => {
    try {
      createNewGenre.mutate(values);
      setIsNew(false);
      reset();
    } catch (err) {
      console.log(err);
      toast({
        className: "bg-red-600 text-light-800",
        title: "Erro ao criar",
        description: `Algo deu errado ao tentar alterar a gênero! ${err}`,
      });

      setIsNew(false);
    }
  };
  return (
    <Dialog open={isNew} onOpenChange={setIsNew}>
      <DialogContent className="flex flex-col items-center sm:max-w-[425px] bg-slate-50">
        <DialogHeader>
          <DialogTitle>Cadastrar o gênero</DialogTitle>
          <DialogDescription>
            Cadastre um novo gênero. Clique em cadastrar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 pb-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center max-w-xs gap-4">
              {/* Nome da Categoria */}
              <div className="flex flex-col w-80 gap-1">
                <Label>Nome:</Label>
                <Input
                  className="w-full"
                  disabled={createNewGenre.isPending}
                  {...register("name")}
                  type="text"
                />

                {errors && (
                  <span className="error text-red-600">
                    {errors.name?.message}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                disabled={createNewGenre.isPending}
                className="focus:shadow-outline mt-5 flex w-full items-center justify-center rounded-lg py-7 font-semibold text-lg tracking-wide text-light-900 transition-all duration-300 ease-in-out bg-blue-900"
              >
                {createNewGenre.isPending ? (
                  <FiRefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <MdSave className="h-5 w-5" />
                )}

                <span className="ml-3">Cadastrar</span>
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NewGenreForm;
