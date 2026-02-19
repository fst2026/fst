function asOrigin(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function expectedOrigin(request: Request) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return null;

  const proto = request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
  return `${proto}://${host}`;
}

export function isSameOrigin(request: Request) {
  const expected = expectedOrigin(request);
  if (!expected) return false;

  const origin = request.headers.get("origin");
  if (origin) {
    return asOrigin(origin) === expected;
  }

  const referer = request.headers.get("referer");
  if (referer) {
    return asOrigin(referer) === expected;
  }

  return false;
}
