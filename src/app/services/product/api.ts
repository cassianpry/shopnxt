import { toast } from "@/components/ui/use-toast";
import { ProductProps } from "@/types/index.d";

export const getProducts = async (searchQuery: Record<string, string>) => {
  const queryString = new URLSearchParams(searchQuery).toString();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product?${queryString}`
  );

  return await response.json();
};

export const getProduct = async (_id: string | "") => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product/${_id}`
  );

  return await response.json();
};
export const getProductBySlug = async (slug: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product/slug/${slug}`
  );

  return await response.json();
};

export const createProduct = async (values: ProductProps) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
    method: "POST",
    body: JSON.stringify(values),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    return response.json().then((error) => {
      toast({
        className: "bg-yellow-600 text-light-800",
        title: "Erro ao cadastrar",
        description: error.error,
      });
    });
  } else {
    toast({
      className: "bg-green-600 text-light-800",
      title: "Produto criado",
      description: "Seu produto foi registrado com sucesso!",
    });
  }
};

export const updateProduct = async (values: ProductProps) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product/${values._id}`,
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
        title: "Erro ao alterar",
        description: error.error,
      });
    });
  } else {
    toast({
      className: "bg-green-600 text-light-800",
      title: "Produto alterado",
      description: "Seu produto foi alterado com sucesso!",
    });
  }
};
