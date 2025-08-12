// types/property.ts
export type Position = [number, number]; // Latitude, Longitude

export interface Property {
  id: number;
  name: string;
  address: string;
  added: string;
  area: number;
  price: number;
  type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  position: Position;
  description?: string;
  image: string; // Optional image URL
}
