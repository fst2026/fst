import { describe, expect, it } from "vitest";
import { isHttpsUrl } from "../url-security";

describe("isHttpsUrl", () => {
  it("accepts valid https url", () => {
    expect(isHttpsUrl("https://example.com/path?q=1")).toBe(true);
  });

  it("rejects http url", () => {
    expect(isHttpsUrl("http://example.com")).toBe(false);
  });

  it("rejects malformed url", () => {
    expect(isHttpsUrl("not-a-url")).toBe(false);
  });
});
