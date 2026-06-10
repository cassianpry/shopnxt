// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  signOut: vi.fn(),
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

import Navbar from "@/components/navbar/Navbar";

describe("Navbar", () => {
  it("renders navigation element", () => {
    cleanup();
    render(
      <Navbar user={null as any} status="unauthenticated" />
    );
    expect(screen.getByRole("navigation")).toBeDefined();
  });

  it("shows login links when unauthenticated", () => {
    cleanup();
    render(<Navbar user={null as any} status="unauthenticated" />);
    const loginLinks = screen.getAllByText("login");
    expect(loginLinks.length).toBeGreaterThan(0);
    expect(screen.getByText("cadastre-se")).toBeDefined();
  });

  it("shows user menu when authenticated", () => {
    cleanup();
    const user = { _id: "1", name: "Test User", email: "test@test.com" };
    render(<Navbar user={user} status="authenticated" />);
    expect(screen.getByTestId("user-menu")).toBeDefined();
    expect(screen.getByText("Olá, Test User")).toBeDefined();
  });
});
