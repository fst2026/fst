import { describe, expect, it } from "vitest";
import { canAccessSettings } from "../authz";

describe("canAccessSettings", () => {
  it("allows super admin without bypass", () => {
    expect(canAccessSettings({ skipAuth: false, isSuperAdmin: true })).toBe(true);
  });

  it("allows bypass without super admin", () => {
    expect(canAccessSettings({ skipAuth: true, isSuperAdmin: false })).toBe(true);
  });

  it("blocks when neither condition is met", () => {
    expect(canAccessSettings({ skipAuth: false, isSuperAdmin: false })).toBe(false);
  });
});
