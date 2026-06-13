export type Property = {
  id: string;
  title: string;
  slug: string;
  category: string;
  city: string;
  neighborhood: string | null;
  price: string;
  operation: "Venda" | "Locação";
  area: string | null;
  bedrooms: number | null;
  suites: number | null;
  bathrooms: number | null;
  parking: number | null;
  cover_image: string | null;
  featured: boolean | null;
  description: string | null;
  created_at: string | null;
};

export type PropertyImage = {
  id: string;
  property_id: string;
  image_url: string;
  created_at: string | null;
};
