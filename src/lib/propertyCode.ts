export function getPropertyCode(id: string | null | undefined) {
  return String(id || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 8)
    .toUpperCase();
}

export function normalizeSearchCode(value: string | null | undefined) {
  return String(value || "")
    .replace("#", "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
}
