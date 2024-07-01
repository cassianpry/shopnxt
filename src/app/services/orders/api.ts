import { toast } from "@/components/ui/use-toast";
import { OrderProps } from "@/types/index.d";

export const getOrders = async (searchQuery: Record<string, string>) => {
  const queryString = new URLSearchParams(searchQuery).toString();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/order?${queryString}`
  );
  return response.json();
};

export const getOrder = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/order/${id}`
  );
  return response.json();
};

export const createOrder = async (values: OrderProps) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
    method: "POST",
    body: JSON.stringify({ values }),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    return response.json().then((error) => {
      console.error(error);
      toast({
        className: "bg-yellow-600 text-light-800",
        title: "Erro ao finalizar a compra, tente novamente",
        description: error.error,
      });
    });
  } else {
    toast({
      className: "bg-green-600 text-light-800",
      title: "Compra finalizada",
      description: "Sua compra foi registrada com sucesso!",
    });
    const orderId = await response.json();
    return orderId;
  }
};
