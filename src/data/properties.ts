// data/properties.ts
import { Property } from "@/types/property";

export const properties: Property[] = [
  {
    id: 1,
    name: "Traditional Bengali Restaurant",
    address: "Dhanmondi 27, Dhaka, Bangladesh",
    added: "August 1, 2025",
    area: 80,
    unit: "sqft",
    price: 2600,
    type: "Restaurant",
    bedrooms: 0,
    bathrooms: 2,
    position: [23.74709, 90.37402],
    image: "/property1.jpg",
    description:
      "A cozy traditional Bengali restaurant offering authentic dishes in the heart of Dhanmondi.",
    feature: true,
    agent: "agent1",
  },
  {
    id: 2,
    name: "Luxury Villa in Gulshan",
    address: "Road 113, Gulshan-2, Dhaka, Bangladesh",
    added: "July 25, 2025",
    area: 1250,
    unit: "sqft",
    price: 4750,
    type: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    position: [23.7925, 90.4145],
    image: "/property2.jpg",
    description:
      "A luxurious villa with modern amenities, private garden, and serene surroundings in Gulshan.",
    feature: false,
    agent: "agent2",
  },
  {
    id: 3,
    name: "Office Space in Motijheel",
    address: "Dilkusha Commercial Area, Motijheel, Dhaka, Bangladesh",
    added: "July 20, 2025",
    area: 2800,
    unit: "sqft",
    price: 3100,
    type: "Office",
    bedrooms: 0,
    bathrooms: 4,
    position: [23.7314, 90.4178],
    image: "/property3.jpg",
    description:
      "Spacious office space located in Dhaka’s prime commercial hub, ideal for corporate use.",
    feature: true,
    agent: "agent3",
  },
];

export const agents = [
  {
    id: 1,
    name: "Nathan James",
    email: "nathan@inspirythemes.com",
    phone: "1-234-456-7893",
  },
  {
    id: 2,
    name: "Melissa William",
    email: "melissa@inspirythemes.com",
    phone: "1-234-456-7892",
  },
  {
    id: 3,
    name: "Alice Brian",
    email: "alice@inspirythemes.com",
    phone: "1-234-456-7891",
  },
];

export const propertyTypes = [
  "Commercial",
  "Office",
  "Shop",
  "Residential",
  "Apartment",
  "Apartment Building",
  "Condominium",
  "Single Family",
  "Villa",
];
