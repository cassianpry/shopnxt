import { describe, it, expect } from "vitest";
import { SignUpSchema, SignInSchema, ProductFormSchema } from "@/lib/actions/validations";

describe("SignUpSchema", () => {
  it("validates a correct sign-up payload", () => {
    const result = SignUpSchema.safeParse({
      name: "João Silva",
      email: "joao@email.com",
      password: "Abc12345",
      confirm_password: "Abc12345",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = SignUpSchema.safeParse({
      name: "João Silva",
      email: "joao@email.com",
      password: "Abc12345",
      confirm_password: "Xyz67890",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short name", () => {
    const result = SignUpSchema.safeParse({
      name: "Jo",
      email: "joao@email.com",
      password: "Abc12345",
      confirm_password: "Abc12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = SignUpSchema.safeParse({
      name: "João Silva",
      email: "not-an-email",
      password: "Abc12345",
      confirm_password: "Abc12345",
    });
    expect(result.success).toBe(false);
  });
});

describe("SignInSchema", () => {
  it("validates correct sign-in payload", () => {
    const result = SignInSchema.safeParse({
      email: "joao@email.com",
      password: "Abc12345",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing email", () => {
    const result = SignInSchema.safeParse({ password: "Abc12345" });
    expect(result.success).toBe(false);
  });
});

describe("ProductFormSchema", () => {
  it("validates a correct product payload", () => {
    const result = ProductFormSchema.safeParse({
      name: "Test Product",
      description: "A great product description here",
      shortDescription: "Short desc here",
      about: "About this product",
      productImage: "https://example.com/img.jpg",
      genres: ["action"],
      developer: "Dev Studio",
      publisher: "Pub Studio",
      system: "Windows 10",
      processor: "Intel i5",
      memory: "8GB",
      storage: "50GB",
      graphicCard: "GTX 1060",
      price: "59.99",
      active: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects product with missing required fields", () => {
    const result = ProductFormSchema.safeParse({ name: "Test" });
    expect(result.success).toBe(false);
  });
});
