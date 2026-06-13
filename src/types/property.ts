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
  status: string | null;
  broker_name: string | null;
  broker_phone: string | null;
  broker_photo: string | null;
  floor_plan_images: string[] | null;
};

export type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: string | null;
  status: string | null;
  checked: boolean | null;
  notes: string | null;
  created_at: string | null;
};
