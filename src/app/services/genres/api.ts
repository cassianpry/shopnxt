import { toast } from "@/components/ui/use-toast";
import { FormGenreValues } from "@/types/index.d";

export const getGenres = async (searchQuery: Record<string, string>) => {
  const queryString = new URLSearchParams(searchQuery).toString();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/genre?${queryString}`
  );

  return response.json();
};

export const getGenre = async (genreId: string) => {
  if (genreId) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/genre/${genreId}`
    );

    return response.json();
  } else {
    return null;
  }
};

export const createGenre = async (values: FormGenreValues) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/genre`, {
      method: "POST",
      body: JSON.stringify(values).toLowerCase(),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const res = await response.json();

      toast({
        className: "bg-red-600 text-light-800",
        title: "Erro ao criar",
        description: `${res.error}`,
      });
    } else {
      toast({
        className: "bg-green-600 text-light-800",
        title: "Gênero cadastrado",
        description: "O gênero foi cadastrado com sucesso!",
        duration: 2000,
      });
    }
  } catch (error) {
    console.log(error);
    toast({
      className: "bg-red-600 text-light-800",
      title: "Erro ao criar",
      description: `Algo deu errado ao tentar cadastrar o gênero! ${error}`,
    });
  }
};

export const updateGenre = async (values: FormGenreValues) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/genre/${values._id}`,
      {
        method: "PUT",
        body: JSON.stringify(values).toLowerCase(),
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
        description: "O gênero foi alterado com sucesso!",
        duration: 2000,
      });
    }
  } catch (error) {
    console.log(error);
    toast({
      className: "bg-red-600 text-light-800",
      title: "Erro ao alterar",
      description: `Algo deu errado ao tentar alterar o gênero! ${error}`,
    });
  }
};
