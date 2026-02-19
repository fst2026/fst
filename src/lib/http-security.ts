export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host");
  if (!host) return false;

  try {
    const url = new URL(origin);
    return url.host === host;
  } catch {
    return false;
  }
}
