// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import React from "react";

afterEach(cleanup);

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => React.createElement("a", { href, ...props }, children),
}));

// Mock Next.js Image
vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement("img", props),
}));

// Mock Next.js useRouter
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock React Query
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}));

// Mock NextAuth session
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "authenticated" }),
}));

// Mock Wishlist Mutations
const mockMutate = vi.fn();
vi.mock("@/app/services/wishlist/mutation", () => ({
  useCreateWishList: () => ({
    mutate: mockMutate,
  }),
}));

import { ProductPriceCard } from "@/components/product/ProductPriceCard";
import { ProductProps } from "@/types/index.d";

describe("ProductPriceCard", () => {
  const mockProducts = [
    {
      _id: "123",
      name: "Destaque Game 1",
      slug: "destaque-game-1",
      productImage: "https://example.com/img1.jpg",
      price: 29.99,
      shortDescription: "A short description 1",
    },
    {
      _id: "456",
      name: "Destaque Game 2",
      slug: "destaque-game-2",
      productImage: "https://example.com/img2.jpg",
      price: "0",
      shortDescription: "A short description 2",
    },
  ] as unknown as ProductProps[];

  const defaultProps = {
    products: mockProducts,
    userId: "user123",
    isWishListed: ["destaque-game-2"],
    setIsWishListed: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the product information correctly", () => {
    render(<ProductPriceCard {...defaultProps} />);

    expect(screen.getByText("Destaque Game 1")).toBeInTheDocument();
    expect(screen.getByText("Destaque Game 2")).toBeInTheDocument();

    // Check BRL formatting for Game 1 (29.99 BRL)
    expect(screen.getByText(/R\$.*29,99/)).toBeInTheDocument();

    // Check "Gratuito" label for Game 2 (price "0")
    expect(screen.getByText("Gratuito")).toBeInTheDocument();
  });

  it("shows correct aria-labels for wishlisted and non-wishlisted products", () => {
    render(<ProductPriceCard {...defaultProps} />);

    // Game 1 is not in wishlist (defaultProps.isWishListed does not contain it)
    const buttonGame1 = screen.getByLabelText("Adicionar à lista de desejos");
    expect(buttonGame1).toBeInTheDocument();

    // Game 2 is in wishlist
    const buttonGame2 = screen.getByLabelText("Na lista de desejos");
    expect(buttonGame2).toBeInTheDocument();
  });

  it("redirects unauthenticated users to /sign-in on wishlist click", () => {
    render(<ProductPriceCard {...defaultProps} userId={undefined} />);

    const buttonGame1 = screen.getByLabelText("Adicionar à lista de desejos");
    fireEvent.click(buttonGame1);

    expect(mockPush).toHaveBeenCalledWith("/sign-in");
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("calls mutate and setIsWishListed on wishlist click for non-wishlisted games", () => {
    render(<ProductPriceCard {...defaultProps} />);

    const buttonGame1 = screen.getByLabelText("Adicionar à lista de desejos");
    fireEvent.click(buttonGame1);

    expect(mockMutate).toHaveBeenCalledWith({ user: "user123", product: "123" });
    expect(defaultProps.setIsWishListed).toHaveBeenCalledWith(["destaque-game-2", "destaque-game-1"]);
  });

  it("redirects authenticated users to their wishlist page on wishlist click for wishlisted games", () => {
    render(<ProductPriceCard {...defaultProps} />);

    const buttonGame2 = screen.getByLabelText("Na lista de desejos");
    fireEvent.click(buttonGame2);

    expect(mockPush).toHaveBeenCalledWith("/profile/user123/wishlist");
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
