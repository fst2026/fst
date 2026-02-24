export function isDevAuthBypassEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.SKIP_AUTH === "true";
}

export function isDevelopmentRuntime() {
  return process.env.NODE_ENV === "development";
}
