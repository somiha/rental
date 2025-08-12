import { properties } from "@/data/properties";
import MapViewWrapper from "@/components/MapViewWrapper";

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full">
      <MapViewWrapper data={properties} />
    </section>
  );
};

export default HeroSection;
