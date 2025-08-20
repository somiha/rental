import { Property } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { BedDouble, Bath, Ruler } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="flex flex-col md:flex-row overflow-hidden border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg py-0 p-2">
      {/* Image */}
      <div className="relative w-full md:w-1/3 h-48 md:h-auto">
        <Image
          src={property.image}
          alt={property.name}
          fill
          sizes="(max-width: 480px) 100vw, 33vw"
          className="object-cover rounded-l-lg"
          priority
        />
        {property.feature && (
          <Badge className="absolute top-3 left-3 bg-accent-600 text-white px-2 py-1 text-xs font-semibold rounded-lg shadow-md">
            Featured
          </Badge>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 p-2 bg-white rounded-r-lg">
        <CardHeader className="p-0">
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-900 tracking-wide">
            {property.name}
          </CardTitle>
          <p className="text-sm md:text-md font-medium text-gray-500 mt-1 tracking-tight">
            {property.address}
          </p>
        </CardHeader>

        {/* Stats */}
        <CardContent className="grid grid-cols-3 text-center text-gray-600 gap-6 border-b border-gray-200 p-2">
          {property.bedrooms !== null && (
            <div className="flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Bedrooms</p>
                <p className="font-medium text-sm text-foreground">
                  {property.bedrooms}
                </p>
              </div>
            </div>
          )}
          {property.bathrooms !== null && (
            <div className="flex items-center gap-2">
              <Bath className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Bathrooms</p>
                <p className="font-medium text-sm text-foreground">
                  {property.bathrooms}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Area</p>
              <p className="font-medium text-sm  text-foreground">
                {property.area} Sq Ft
              </p>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-between items-center px-2 border-gray-300">
          <div>
            <p className="font-bold text-primary-600 tracking-tight">
              {property.price}$
            </p>
          </div>
          <div className="text-right">
            <Button
              variant="outline"
              className="mt-1 border-primary-500 text-primary-500 hover:bg-primary-50 font-semibold tracking-wide"
            >
              View Details
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
