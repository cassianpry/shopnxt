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
      <DialogContent className="flex flex-col items-center bg-dark-300 border-dark-400 text-text-high">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl text-text-high">
            Trocar a senha
          </DialogTitle>
          <DialogDescription className="text-text-muted text-sm">
            Insira seu e-mail para receber as instruções para criar uma nova
            senha
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 items-center w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-5 pt-2"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-text-body text-sm mb-1 block">
                      <span className="text-red-400">*</span>&nbsp;E-mail
                    </FormLabel>
                    <FormMessage className="text-red-400 text-xs" />
                    <FormControl className="mt-1">
                      <Input
                        className="w-full bg-dark-400 border border-dark-500 rounded-md px-4 py-2.5 text-sm text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                        disabled={resetUserPassword.isPending}
                        type="email"
                        {...field}
                      />
                    </FormControl>

                  </FormItem>
                )}
              />

              <div className="flex items-center justify-center gap-2">
                <Button
                  type="submit"
                  disabled={resetUserPassword.isPending}
                  className="w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-md px-6 py-2.5 text-sm transition-colors cursor-pointer"
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
