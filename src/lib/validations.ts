import * as z from "zod";

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Precisa ter pelo menos 3 caracteres." })
      .max(25, { message: "Nome muito extenso." }),
    username: z
      .string()
      .min(3, { message: "Precisa ter pelo menos 3 caracteres. " })
      .max(25, { message: "Nome muito extenso." }),
    email: z.string().email().min(5, { message: "E-mail inválido." }),
    password: z.string().min(5, { message: "Mínimo de 5 caracteres" }),
    confirm_password: z.string().min(5, { message: "Mínimo de 5 caracteres" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As senhas não são iguais.",
    path: ["confirm_password"],
  });

export const SignInSchema = z.object({
  email: z.string().email().min(5, { message: "E-mail inválido." }),
  password: z.string().min(5, { message: "Mínimo de 5 caracteres" }),
});
