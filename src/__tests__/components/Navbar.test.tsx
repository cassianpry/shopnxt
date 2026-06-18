// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

afterEach(cleanup);

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  signOut: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/components/navbar/NavItems", () => ({
  default: () => <div data-testid="nav-items" />,
}));

vi.mock("@/components/navbar/Theme", () => ({
  default: () => <div data-testid="theme" />,
}));

vi.mock("@/components/navbar/UserMenu", () => ({
  default: ({ user }: { user: { name?: string } }) => (
    <div data-testid="user-menu">Olá, {user?.name}</div>
  ),
}));

vi.mock("@/components/search/SearchBar", () => ({
  default: () => <div data-testid="search-bar" />,
}));

import Navbar from "@/components/navbar/Navbar";
import CartProvider from "@/context/CartContext";

function renderWithProviders(ui: React.ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>);
}

describe("Navbar", () => {
  it("renders navigation element", () => {
    renderWithProviders(
      <Navbar user={null} status="unauthenticated" />
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("shows login links when unauthenticated", () => {
    renderWithProviders(<Navbar user={null} status="unauthenticated" />);
    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar")).toBeInTheDocument();
  });

  it("shows user menu when authenticated", () => {
    const user = { _id: "1", name: "Test User", email: "test@test.com", role: "user" };
    renderWithProviders(<Navbar user={user} status="authenticated" />);
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
    expect(screen.getByText("Olá, Test User")).toBeInTheDocument();
  });
});