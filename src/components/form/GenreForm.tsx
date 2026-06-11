import React, { useEffect } from "react";
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
import { FormGenreProps } from "@/types/index.d";
import { useGenre } from "@/app/services/genres/queries";
import { useUpdateGenre } from "@/app/services/genres/mutations";

interface FormValues {
  _id?: string;
  name: string;
}

function GenreForm({ isOpen, setIsOpen, genre }: FormGenreProps) {
  const newGenre = useGenre(genre);

  const updateGenre = useUpdateGenre();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(GenreFormSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (
    values: z.infer<typeof GenreFormSchema>
  ) => {
    values._id = newGenre.data._id;
    try {
      updateGenre.mutate({ ...values });
    } catch (error) {
      console.log(error);
      toast({
        className: "bg-red-600 text-white",
        title: "Erro ao criar",
        description: `Algo deu errado ao tentar criar a categoria! ${error}`,
      });
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (newGenre.data) {
      setValue("name", newGenre.data.name);
    }
  }, [newGenre.data, setValue]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        reset();
        setIsOpen(false);
      }}
    >
      <DialogContent className="flex flex-col items-center sm:max-w-[425px] bg-dark-300 text-text-body">
        <DialogHeader>
          <DialogTitle className="text-text-high">Alterar a categoria</DialogTitle>
          <DialogDescription className="text-text-muted">
            Altere o nome da categoria. Clique em alterar quando terminar.
          </DialogDescription>
        </DialogHeader>
        {newGenre?.data !== undefined ? (
          <>
            <div className="flex flex-col gap-1 ">
              <span>_id:&nbsp;{newGenre.data?._id}</span>
              <span>Slug:&nbsp;{newGenre.data?.slug}</span>
            </div>
            <div className="grid gap-4 pb-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col items-center max-w-xs gap-4">
                  {/* Nome da Categoria */}
                  <div className="flex flex-col w-80 gap-1">
                    <Label>Nome:</Label>
                    <Input
                      className="w-full"
                      {...register("name")}
                      defaultValue={newGenre.data?.name}
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
                    disabled={newGenre.isPending}
                    className="btn-primary mt-5 w-full py-3"
                  >
                    {newGenre.isPending ? (
                      <FiRefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <MdSave className="h-5 w-5" />
                    )}

                    <span className="ml-2">Alterar</span>
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <FiRefreshCw className="h-5 w-5 animate-spin" />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default GenreForm;
