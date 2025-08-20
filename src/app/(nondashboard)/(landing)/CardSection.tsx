import { properties } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
export default function PropertiesPage() {
  return (
    <section className="relative w-full bg-secondary-100">
      <div className="container mx-auto px-8 py-8 w-3/4">
        <motion.div variants={itemVariants} className="my-12 text-center">
          <h1 className="text-3xl font-bold mb-2">Latest Properties</h1>
          <p className="text-muted-foreground">
            Check out some of our recent properties.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          {[1, 2, 3, 4].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "default" : "outline"}
              size="sm"
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
