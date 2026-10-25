export function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";
  if (!base) return "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}
