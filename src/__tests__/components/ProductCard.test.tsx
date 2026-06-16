// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

afterEach(cleanup);

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

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement("img", props),
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

vi.mock("@/app/services/wishlist/mutation", () => ({
  useCreateWishList: () => ({ mutate: vi.fn() }),
}));

import ProductCard from "@/components/product/ProductCard";

describe("ProductCard", () => {
  const baseProduct = {
    description: "Full description",
    about: "About this game",
    genres: [{ _id: "g1", name: "Action" }],
    developer: "Dev Studio",
    publisher: "Pub Studio",
    system: "Windows",
    processor: "Intel",
    memory: "8GB",
    storage: "50GB",
    graphicCard: "RTX 2060",
    active: true,
  };

  const mockProducts = [
    {
      _id: "123",
      name: "Test Game",
      slug: "test-game",
      productImage: "https://example.com/img.jpg",
      price: "29.99",
      shortDescription: "A short description",
      ...baseProduct,
    },
    {
      _id: "456",
      name: "Another Game",
      slug: "another-game",
      productImage: "https://example.com/img2.jpg",
      price: "49.99",
      shortDescription: "Another description",
      ...baseProduct,
    },
  ];

  const defaultProps = {
    products: mockProducts,
    userId: "user1",
    isWishListed: [] as string[],
    setIsWishListed: vi.fn() as React.Dispatch<React.SetStateAction<string[]>>,
  };

  it("renders product information", () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.getByText("Another Game")).toBeInTheDocument();
  });

  it("renders free label when price is 0", () => {
    const freeProducts = mockProducts.map((p) => ({ ...p, price: "0" }));
    render(
      <ProductCard {...defaultProps} products={freeProducts} />
    );
    expect(screen.getAllByText("Gratuito").length).toBe(2);
  });

  it("renders loading state when isLoading is true", () => {
    const { container } = render(
      <ProductCard {...defaultProps} isLoading={true} />
    );
    const animatedDivs = container.querySelectorAll(".animate-pulse");
    expect(animatedDivs.length).toBeGreaterThan(0);
  });
});
