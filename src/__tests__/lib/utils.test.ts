import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names correctly", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden")).toBe("base");
    expect(cn("base", true && "visible")).toBe("base visible");
  });

  it("handles undefined and null values", () => {
    expect(cn("a", undefined, "b", null)).toBe("a b");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });
});
