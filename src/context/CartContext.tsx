import { ProductProps } from "@/types/index.d";
import React, { createContext, useContext, useEffect, useState } from "react";

function isValidCartData(data: unknown): data is ProductProps[] {
  return Array.isArray(data) && data.every(
    (item) => typeof item === "object" && item !== null && "_id" in item
  );
}

interface CartContextProps {
  cartProducts: ProductProps[];
  addToCart: (products: ProductProps) => void;
  removeFromCart: (prodIndex: number) => void;
  clearCart: () => void;
  setCartProducts: React.Dispatch<React.SetStateAction<ProductProps[]>>;
}

export const CartContext = createContext<CartContextProps | undefined>(
  undefined
);

export function useCart(): CartContextProps {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartProducts, setCartProducts] = useState<ProductProps[]>([]);

  const ls = typeof window !== "undefined" ? window.localStorage : null;

  const saveToLocalStorage = (cartProducts: ProductProps[]) => {
    if (ls) {
      ls.setItem("cart", JSON.stringify(cartProducts));
    }
  };

  const addToCart = (product: ProductProps) => {
    setCartProducts((prevProduct) => {
      const newProducts = [...prevProduct, product];
      saveToLocalStorage(newProducts);
      return newProducts;
    });
  };

  const removeFromCart = (prodIndex: number) => {
    setCartProducts((prevProduct) => {
      const newProducts = prevProduct.filter(
        (p: ProductProps, index) => index !== prodIndex
      );
      saveToLocalStorage(newProducts);
      return newProducts;
    });
  };

  const clearCart = () => {
    setCartProducts([]);
    ls?.removeItem("cart");
    saveToLocalStorage([]);
  };

  useEffect(() => {
    if (ls && ls.getItem("cart")) {
      const storedCart = ls.getItem("cart");
      if (storedCart) {
        try {
          const parsed = JSON.parse(storedCart);
          setCartProducts(isValidCartData(parsed) ? parsed : []);
        } catch {
          setCartProducts([]);
        }
      }
    }
  }, [ls]);

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        addToCart,
        removeFromCart,
        clearCart,
        setCartProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
