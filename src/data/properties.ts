// data/properties.ts
import { Property } from "@/types/property";

export const properties: Property[] = [
  {
    id: 1,
    name: "Traditional Food Restaurant",
    address: "Sunset Drive, Miami, FL, USA",
    added: "June 12, 2017",
    area: 80,
    price: 2600,
    type: "Restaurant",
    bedrooms: 2,
    bathrooms: 1,
    position: [25.737727, -80.224731],
    image: "/property1.jpg",
    description:
      "A charming traditional food restaurant in the heart of Miami.",
  },
  {
    id: 2,
    name: "Villa on Grand Avenue",
    address: "GoodWalk, 3015 Grand Avenue, Miami, FL, 33153, USA",
    added: "June 11, 2017",
    area: 1250,
    price: 4750,
    type: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    position: [25.761681, -80.191788],
    image: "/property2.jpg",
    description: "Luxurious villa with modern amenities and beautiful views.",
  },
  {
    id: 3,
    name: "Office Space at Northwest 107th",
    address: "Northwest 107th Avenue, Dorai, FL, 33778, USA",
    added: "June 10, 2017",
    area: 2800,
    price: 3100,
    type: "Office",
    bedrooms: 4,
    bathrooms: 4,
    position: [25.790363, -80.212456],
    image: "/property3.jpg",
    description: "Spacious office space in a prime business location.",
  },
];
