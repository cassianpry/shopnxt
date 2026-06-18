import { z } from "zod";

export const SignUpSchema = z
  .object({
    name: z
      .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
      .min(3, { message: "Mínimo de 3 caracteres." })
      .max(25, { message: "Máximo de 25 caracteres." })
      .regex(
        /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/i,
        "Somente letras."
      ),

    email: z
      .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
      .email()
      .min(5, { message: "E-mail inválido." }),

    password: z.string().min(8, { message: "Mínimo de 8 caracteres." }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: "Deve conter letra maiúscula, minúscula e número." }),

    confirm_password: z.string().min(8, { message: "Mínimo de 8 caracteres." }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As senhas não são iguais.",
    path: ["confirm_password"],
  });

export const SignInSchema = z.object({
  email: z
    .string({ error: (issue) => issue.input === undefined ? "E-mail inválido" : "Precisa ser uma string" })
    .email({ message: "E-mail inválido" })
    .min(5, { message: "E-mail inválido." }),
  password: z.string().min(8, { message: "Mínimo de 8 caracteres." }),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string({ error: (issue) => issue.input === undefined ? "E-mail inválido" : "Precisa ser uma string" })
    .email({ message: "E-mail inválido" })
    .min(5, { message: "E-mail inválido." }),
});

export const ResetPasswordSchema = z
  .object({
    userId: z.string().optional(),

    password: z.string().min(8, { message: "Mínimo de 8 caracteres." }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: "Deve conter letra maiúscula, minúscula e número." }),

    confirm_password: z.string().min(8, { message: "Mínimo de 8 caracteres." }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As senhas não são iguais.",
    path: ["confirm_password"],
  });

const addressFields = {
  name: z.string().min(3, { message: "Mínimo de 3 caracteres." }).max(25, { message: "Máximo de 25 caracteres." }).regex(/^[A-Za-z\u00C0-\u00FF ]+$/i, "Somente letras."),
  address: z.string().max(250, { message: "Endereço muito extenso" }),
  postalCode: z.string().min(9, { message: "CEP Inválido" }).max(9, { message: "CEP Inválido" }),
  state: z.string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" }).regex(/^[A-Za-z]+$/i, "Inválido."),
  city: z.string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" }).regex(/^[\p{L}\s]+$/u, "Inválido.").max(50, { message: "Cidade muito extenso" }),
  phone: z.string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" }).min(10, { message: "Numero de telefone inválido" }).max(11),
};

const addressSchema = z.object(addressFields);

export const ProfileSchema = z.object({
  _id: z.string().optional(),

  name: addressFields.name,

  email: z
    .string({ error: (issue) => issue.input === undefined ? "E-mail inválido" : "Precisa ser uma string" })
    .email({ message: "E-mail inválido" })
    .min(5, { message: "E-mail inválido." }),

  role: z.string(),

  address: addressFields.address,

  postalCode: addressFields.postalCode,

  state: addressFields.state,

  city: addressFields.city,

  phone: addressFields.phone,
});

export const GenreFormSchema = z.object({
  _id: z.string().optional(),

  name: z
    .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
    .min(3, { message: "Precisa ter pelo menos 3 caracteres." })
    .max(25, { message: "Máximo de 25 caracteres." }),
});

export const ProductFormSchema = z.object({
  _id: z.string().optional(),

  name: z
    .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
    .min(3, { message: "Precisa ter pelo menos 3 caracteres." })
    .max(50, { message: "Máximo de 50 caracteres." }),

  description: z
    .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
    .min(10, { message: "No mínimo de 10 caracteres." })
    .max(250, { message: "Máximo de 250 caracteres." }),

  shortDescription: z
    .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
    .min(10, { message: "No mínimo de 10 caracteres." }),

  about: z
    .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
    .min(10, { message: "No mínimo de 10 caracteres." }),

  productImage: z.any(),

  genres: z
    .array(z.string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" }))
    .min(1, { message: "Precisa escolher pelo menos 1 gênero." }),

  developer: z
    .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
    .min(3, { message: "Precisa ter pelo menos 3 caracteres." }),

  publisher: z
    .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
    .min(3, { message: "Precisa ter pelo menos 3 caracteres." }),

  system: z
    .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
    .min(3, { message: "Precisa ter pelo menos 3 caracteres." }),

  processor: z
    .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
    .min(3, { message: "Precisa ter pelo menos 3 caracteres." }),

  memory: z
    .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
    .min(1, { message: "Precisa ser preenchido." }),

  storage: z
    .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
    .min(1, { message: "Precisa ser preenchido." }),

  graphicCard: z
    .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
    .min(3, { message: "Mínimo de 3 caracteres." }),

  price: z
    .number({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser um número" })
    .nonnegative({ message: "Preço não pode ser negativo." }),

  active: z.boolean().optional(),
});

const billingAddressFields = {
  billingAddress: z.string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" }).min(5, { message: "Endereço inválido" }).max(250, { message: "Endereço muito extenso" }),
  billingPostalCode: z.string().min(9, { message: "CEP Inválido" }).max(9, { message: "CEP Inválido" }),
  billingState: z.string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" }).regex(/^[A-Za-z]+$/i, "Inválido."),
  billingCity: z.string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" }).regex(/^[\p{L}\s]+$/u, "Inválido.").max(50, { message: "Limite de 50 caracteres" }),
};

export const UserOrderSchema = z.object({
  _id: z.string().optional(),

  name: addressFields.name,

  email: z
    .string({ error: (issue) => issue.input === undefined ? "E-mail inválido" : "Precisa ser uma string" })
    .email({ message: "E-mail inválido" })
    .min(5, { message: "E-mail inválido." }),

  address: addressFields.address,

  postalCode: addressFields.postalCode,

  state: addressFields.state,

  city: addressFields.city,

  phone: addressFields.phone,

  checkAddress: z.boolean(),

  ...billingAddressFields,
});
