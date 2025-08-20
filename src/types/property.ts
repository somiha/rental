// types/property.ts
export type Position = [number, number]; // Latitude, Longitude

export interface Property {
  id: number;
  name: string;
  address: string;
  added: string;
  area: number;
  unit: string; // e.g., "sq ft", "sqm"
  price: number;
  type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  position: Position;
  description?: string;
  image: string; // Optional image URL
  feature: true | false; // Indicates if the property is featured
  agent: string; // Optional agent ID for properties listed by agents
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface PropertyTypeFilterProps {
  types: string[];
}
