import { toast } from "@/components/ui/use-toast";
import { UserProps } from "@/types/index.d";

export const getUsers = async (searchQuery: Record<string, string>) => {
  const queryString = new URLSearchParams(searchQuery).toString();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user?${queryString}`
  );

  return await response.json();
};

export const getUser = async (userId: string) => {
  if (userId !== "") {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`
    );
    return await response.json();
  } else {
    return null;
  }
};

// export const createUser = async (values: FormProfileProps) => {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/register`,
//       {
//         method: "POST",
//         body: JSON.stringify(values),
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     if (!response.ok) {
//       const res = await response.json();

//       toast({
//         className: "bg-red-600 text-light-800",
//         title: "Erro ao criar",
//         description: `${res.error}`,
//       });
//     } else {
//       toast({
//         className: "bg-green-600 text-light-800",
//         title: "Gênero cadastrado",
//         description: "O usuário foi cadastrado com sucesso!",
//         duration: 2000,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     toast({
//       className: "bg-red-600 text-light-800",
//       title: "Erro ao criar",
//       description: `Algo deu errado ao tentar cadastrar o usuário! ${error}`,
//     });
//   }
// };

export const updateUser = async (values: UserProps) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${values._id}`,
      {
        method: "PUT",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      const res = await response.json();
      toast({
        className: "bg-red-600 text-light-800",
        title: "Erro ao alterar",
        description: `${res.error}`,
      });
    } else {
      toast({
        className: "bg-green-600 text-light-800",
        title: "Categoria alterada",
        description: "O usuário foi alterado com sucesso!",
        duration: 2000,
      });
    }
  } catch (error) {
    console.log(error);
    toast({
      className: "bg-red-600 text-light-800",
      title: "Erro ao alterar",
      description: `Algo deu errado ao tentar alterar o usuário! ${error}`,
    });
  }
};

export const resetPasswordUser = async (values: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/forgot-password/${values}`,
      {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      //Return nothing
    }
  } catch (error) {
    console.log(error);
  }
};

export const updatePasswordUser = async (values: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/forgot-password/`,
      {
        method: "PUT",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      return response.json().then((error) => {
        toast({
          className: "bg-yellow-600 text-light-800",
          title: "Algo deu errado",
          description: error.error,
        });
      });
    } else {
      toast({
        className: "bg-green-600 text-light-800",
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getToken = async (searchQuery: Record<string, string>) => {
  const queryString = new URLSearchParams(searchQuery).toString();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/forgot-password?${queryString}`
  );

  return await response.json();
};
