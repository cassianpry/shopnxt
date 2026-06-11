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

    password: z.string().min(5, { message: "Mínimo de 5 caracteres" }),

    confirm_password: z.string().min(5, { message: "Mínimo de 5 caracteres" }),
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
  password: z.string().min(5, { message: "Mínimo de 5 caracteres" }),
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

    password: z.string().min(5, { message: "Mínimo de 5 caracteres" }),

    confirm_password: z.string().min(5, { message: "Mínimo de 5 caracteres" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As senhas não são iguais.",
    path: ["confirm_password"],
  });

export const ProfileSchema = z.object({
  _id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: "Mínimo de 3 caracteres." })
    .max(25, { message: "Máximo de 25 caracteres." })
    .regex(/^[A-Za-z\u00C0-\u00FF ]+$/i, "Somente letras."),

  email: z
    .string({ error: (issue) => issue.input === undefined ? "E-mail inválido" : "Precisa ser uma string" })
    .email({ message: "E-mail inválido" })
    .min(5, { message: "E-mail inválido." }),

  role: z.string(),

  address: z.string().max(250, { message: "Endereço muito extenso" }),

  postalCode: z
    .string()
    .min(9, { message: "CEP Inválido" })
    .max(9, { message: "CEP Inválido" }),

  state: z
    .string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" })
    .regex(/^[A-Za-z]+$/i, "Inválido."),

  city: z
    .string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" })
    .regex(/^[\p{L}\s]+$/u, "Inválido.")
    .max(50, { message: "Cidade muito extenso" }),

  phone: z
    .string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" })
    .min(10, { message: "Numero de telefone inválido" })
    .max(11),
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
    .string({ error: (issue) => issue.input === undefined ? "Precisa ser preenchido." : "Precisa ser uma string" })
    .min(1, { message: "Precisa ser preenchido." }),

  active: z.boolean().optional(),
});

export const UserOrderSchema = z.object({
  _id: z.string().optional(),

  name: z
    .string()
    .min(3, { message: "Mínimo de 3 caracteres." })
    .max(25, { message: "Máximo de 25 caracteres." })
    .regex(/^[A-Za-z\u00C0-\u00FF ]+$/i, "Somente letras."),

  email: z
    .string({ error: (issue) => issue.input === undefined ? "E-mail inválido" : "Precisa ser uma string" })
    .email({ message: "E-mail inválido" })
    .min(5, { message: "E-mail inválido." }),

  address: z.string().max(250, { message: "Endereço muito extenso" }),

  postalCode: z
    .string()
    .min(9, { message: "CEP Inválido" })
    .max(9, { message: "CEP Inválido" }),

  state: z
    .string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" })
    .regex(/^[A-Za-z]+$/i, "Inválido."),

  city: z
    .string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" })
    .regex(/^[\p{L}\s]+$/u, "Inválido.")
    .max(50, { message: "Cidade muito extenso" }),

  phone: z
    .string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" })
    .min(10, { message: "Numero de telefone inválido" })
    .max(11),

  cardNumber: z
    .string({ error: (issue) => issue.input === undefined ? "Numero do cartão Inválido" : "Precisa ser uma string" })
    .length(16, { message: "Numero do cartão inválido" })
    .regex(/^[0-9]+$/i, "Apenas números."),

  expireDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato de  MM/AA")
    .refine(
      (value) => {
        // Extrair o mês e o ano da string
        const [monthStr, yearStr] = value.split("/");

        // Converter os valores para números
        const month = parseInt(monthStr);
        const year = parseInt(yearStr);

        // Verificar se o mês é válido (de 1 a 12) e se o ano tem 2 dígitos
        if (
          isNaN(month) ||
          isNaN(year) ||
          month < 1 ||
          month > 12 ||
          year < 0 ||
          year > 99
        ) {
          return false;
        }

        // Obter o ano atual
        const currentYear = new Date().getFullYear() % 100; // Pegar apenas os 2 últimos dígitos

        // Obter o mês atual
        const currentMonth = new Date().getMonth() + 1; // Janeiro é 0, então adicionamos 1

        // Comparar a data inserida com a data atual
        if (
          year > currentYear ||
          (year === currentYear && month > currentMonth)
        ) {
          return true; // Data válida
        } else {
          return false; // Data expirada
        }
      },
      {
        message: "Expirada ou inválida",
      }
    ),
  cvv: z
    .string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" })
    .length(3, { message: "CVV inválido" })
    .regex(/^[0-9]+$/i, "Inválido."),

  checkAddress: z.boolean(),

  billingAddress: z
    .string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" })
    .min(5, { message: "Endereço inválido" })
    .max(250, { message: "Endereço muito extenso" }),

  billingPostalCode: z
    .string()
    .min(9, { message: "CEP Inválido" })
    .max(9, { message: "CEP Inválido" }),

  billingState: z
    .string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" })
    .regex(/^[A-Za-z]+$/i, "Inválido."),

  billingCity: z
    .string({ error: (issue) => issue.input === undefined ? "Inválido" : "Precisa ser uma string" })
    .regex(/^[\p{L}\s]+$/u, "Inválido.")
    .max(50, { message: "Limite de 50 caracteres" }),
});
