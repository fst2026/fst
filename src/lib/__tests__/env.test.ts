import { afterEach, describe, expect, it } from "vitest";
import { isDevAuthBypassEnabled } from "../env";

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;
const ORIGINAL_SKIP_AUTH = process.env.SKIP_AUTH;

afterEach(() => {
  process.env.NODE_ENV = ORIGINAL_NODE_ENV;
  process.env.SKIP_AUTH = ORIGINAL_SKIP_AUTH;
});

describe("isDevAuthBypassEnabled", () => {
  it("returns false in production even when SKIP_AUTH=true", () => {
    process.env.NODE_ENV = "production";
    process.env.SKIP_AUTH = "true";

    expect(isDevAuthBypassEnabled()).toBe(false);
  });

  it("returns true in development when SKIP_AUTH=true", () => {
    process.env.NODE_ENV = "development";
    process.env.SKIP_AUTH = "true";

    expect(isDevAuthBypassEnabled()).toBe(true);
  });
});
