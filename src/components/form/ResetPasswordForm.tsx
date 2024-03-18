import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { ForgotPasswordSchema } from "@/lib/actions/validations";
import { useResetPassword } from "@/app/services/users/mutations";
import { MdAutorenew, MdLogin } from "react-icons/md";

export interface ResetPasswordFormProps {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen?: boolean;
}

function ResetPasswordForm({ isOpen, setIsOpen }: ResetPasswordFormProps) {
  const resetUserPassword = useResetPassword();
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    try {
      resetUserPassword.mutate(values);
    } catch (error) {
      console.log(error);
    }
    form.reset();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen!(false);
        form.reset();
      }}
    >
      <DialogContent className="flex flex-col items-center bg-slate-50">
        <DialogHeader>
          <DialogTitle className="font-semibold text-2xl">
            Trocar a senha
          </DialogTitle>
          <DialogDescription>
            Insira seu e-mail para receber as instruções para criar uma nova
            senha
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 pt-2 text-dark400_light700"
            >
              {/* E-mail */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-md font-medium text-dark-500">
                      <span className="text-red-600">*</span>&nbsp;E-mail
                    </FormLabel>
                    <FormMessage className="text-red-600" />
                    <FormControl className="mt-1">
                      <Input
                        className="text-dark-500"
                        disabled={resetUserPassword.isPending}
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-slate-600"></FormDescription>
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-center gap-2">
                <Button
                  type="submit"
                  disabled={resetUserPassword.isPending}
                  className="focus:shadow-outline flex w-full items-center justify-center rounded-lg py-5 font-semibold text-lg text-light-900 transition-all duration-300 ease-in-out bg-blue-900 hover:bg-blue-600"
                >
                  {resetUserPassword.isPending ? (
                    <>
                      <MdAutorenew className="w-5 h-5 mr-2 animate-spin" />
                      <p className="animate-pulse">Aguarde...</p>
                    </>
                  ) : (
                    <>
                      <MdLogin className="w-5 h-5 mr-2" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ResetPasswordForm;
