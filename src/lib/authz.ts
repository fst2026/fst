export function canAccessSettings(input: {
  skipAuth: boolean;
  isSuperAdmin: boolean;
}): boolean {
  return input.skipAuth || input.isSuperAdmin;
}
