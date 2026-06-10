import { describe, it, expect } from "vitest";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  ProfileSchema,
  GenreFormSchema,
  UserOrderSchema,
} from "@/lib/actions/validations";

describe("ForgotPasswordSchema", () => {
  it("validates a correct email", () => {
    const result = ForgotPasswordSchema.safeParse({ email: "user@test.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = ForgotPasswordSchema.safeParse({ email: "bad" });
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = ForgotPasswordSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("ResetPasswordSchema", () => {
  it("validates matching passwords", () => {
    const result = ResetPasswordSchema.safeParse({
      password: "12345",
      confirm_password: "12345",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = ResetPasswordSchema.safeParse({
      password: "12345",
      confirm_password: "54321",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = ResetPasswordSchema.safeParse({
      password: "1234",
      confirm_password: "1234",
    });
    expect(result.success).toBe(false);
  });
});

describe("ProfileSchema", () => {
  it("validates a correct profile", () => {
    const result = ProfileSchema.safeParse({
      name: "User Name",
      email: "user@test.com",
      role: "user",
      address: "Rua A, 123",
      postalCode: "12345-678",
      state: "SP",
      city: "São Paulo",
      phone: "11999999999",
    });
    expect(result.success).toBe(true);
  });

  it("rejects profile with invalid postalCode", () => {
    const result = ProfileSchema.safeParse({
      name: "User Name",
      email: "user@test.com",
      role: "user",
      address: "Rua A",
      postalCode: "123",
      state: "SP",
      city: "São Paulo",
      phone: "11999999999",
    });
    expect(result.success).toBe(false);
  });
});

describe("GenreFormSchema", () => {
  it("validates a correct genre", () => {
    const result = GenreFormSchema.safeParse({ name: "Action" });
    expect(result.success).toBe(true);
  });

  it("rejects short genre name", () => {
    const result = GenreFormSchema.safeParse({ name: "Ac" });
    expect(result.success).toBe(false);
  });
});

describe("UserOrderSchema", () => {
  const validOrder = {
    name: "Buyer Name",
    email: "buyer@test.com",
    address: "Rua A, 123",
    postalCode: "12345-678",
    state: "SP",
    city: "São Paulo",
    phone: "11999999999",
    cardNumber: "1234567890123456",
    expireDate: "12/30",
    cvv: "123",
    checkAddress: true,
    billingAddress: "Rua A, 123",
    billingPostalCode: "12345-678",
    billingState: "SP",
    billingCity: "São Paulo",
  };

  it("validates a correct order", () => {
    const result = UserOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it("rejects order with invalid card number", () => {
    const result = UserOrderSchema.safeParse({
      ...validOrder,
      cardNumber: "123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects order with expired card date", () => {
    const result = UserOrderSchema.safeParse({
      ...validOrder,
      expireDate: "01/20",
    });
    expect(result.success).toBe(false);
  });
});
