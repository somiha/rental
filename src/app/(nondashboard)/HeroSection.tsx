import dynamic from "next/dynamic";
const MapView = dynamic(() => import("../../components/Mapview"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-gray-200 animate-pulse" />,
});

interface Apartment {
  id: number;
  position: [number, number]; // [lat, lng]
  name: string;
  price: string;
  image: string;
}

const apartments: Apartment[] = [
  {
    id: 1,
    position: [25.77, -80.185],
    name: "Home in Merrick Way",
    price: "$540,000",
    image:
      "https://images.unsplash.com/photo-1560448072-6a5f9e1b2394?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    position: [25.775, -80.17],
    name: "Downtown Apartment",
    price: "$650,000",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
  },
];

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full">
      <MapView data={apartments} />
    </section>
  );
};

export default HeroSection;
