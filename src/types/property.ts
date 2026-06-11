export type Property = {
  id: string;
  title: string;
  category: string;
  city: string;
  neighborhood: string;
  price: string;
  operation: "Venda" | "Locação";
  area: string;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking: number;
  image: string;
  featured: boolean;
  description: string;
  highlights: string[];
};
