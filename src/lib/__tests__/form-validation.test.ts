import { describe, expect, it } from "vitest";
import { validateRegistrationNumber } from "../form-validation";

describe("validateRegistrationNumber", () => {
  it("accepts valid registration up to 10 chars", () => {
    expect(validateRegistrationNumber("GD 12345")).toBeUndefined();
    expect(validateRegistrationNumber("WX1234ABCD")).toBeUndefined();
  });

  it("rejects too short and too long values", () => {
    expect(validateRegistrationNumber("A1")).toContain("za krótki");
    expect(validateRegistrationNumber("AB123456789")).toContain("za długi");
  });

  it("rejects invalid characters", () => {
    expect(validateRegistrationNumber("GD-1234")).toContain("Dozwolone tylko litery i cyfry");
  });
});
