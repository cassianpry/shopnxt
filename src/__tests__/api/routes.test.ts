import { describe, it, expect } from "vitest";
import { SignInSchema, SignUpSchema } from "@/lib/actions/validations";

describe("API Route Validation", () => {
  it("rejects invalid registration payloads", () => {
    const result = SignUpSchema.safeParse({ name: "", email: "bad", password: "12" });
    expect(result.success).toBe(false);
  });

  it("accepts valid sign-in payloads", () => {
    const result = SignInSchema.safeParse({ email: "user@test.com", password: "12345" });
    expect(result.success).toBe(true);
  });
});
