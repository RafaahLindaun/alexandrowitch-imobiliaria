import { CITY_OPTIONS } from "../data/locationOptions";

type PropertyLocation = {
  city: string | null;
  neighborhood: string | null;
};

export type AvailableLocations = Record<string, string[]>;

export function buildAvailableLocations(properties: PropertyLocation[] | null | undefined) {
  const result: AvailableLocations = {};

  CITY_OPTIONS.forEach((city) => {
    result[city] = [];
  });

  (properties || []).forEach((property) => {
    const city = property.city || "";
    const neighborhood = property.neighborhood || "";
    if (!city || !neighborhood) return;
    if (!result[city]) result[city] = [];
    if (!result[city].includes(neighborhood)) result[city].push(neighborhood);
  });

  Object.keys(result).forEach((city) => result[city].sort((a, b) => a.localeCompare(b, "pt-BR")));
  return result;
}
