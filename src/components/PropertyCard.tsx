"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, BedDouble, Bath, Ruler } from "lucide-react";
import MapModal from "@/components/MapModal";
import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 ease-in-out border-0 rounded-xl overflow-hidden bg-card">
      <Link href={`/properties/${property.id}`} className="block group">
        <div className="relative h-56 w-full">
          <Image
            src={property.image || "/placeholder-property.jpg"}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md">
            For Rent
          </Badge>
        </div>
      </Link>

      <CardHeader className="px-6 pt-4 pb-2">
        <Link href={`/properties/${property.id}`}>
          <CardTitle className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
            {property.name}
          </CardTitle>
        </Link>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <MapPin className="w-4 h-4 mr-1 text-primary" />
          <MapModal address={property.address} position={property.position}>
            <span className="hover:text-primary transition-colors cursor-pointer">
              {property.address.split(",")[0]} {/* Show just the street */}
            </span>
          </MapModal>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Added: {property.added}
        </p>
      </CardHeader>

      <CardContent className="px-6 py-2">
        <div className="flex flex-wrap gap-4">
          {property.bedrooms && (
            <div className="flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Bedrooms</p>
                <p className="font-medium text-foreground">
                  {property.bedrooms}
                </p>
              </div>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-2">
              <Bath className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Bathrooms</p>
                <p className="font-medium text-foreground">
                  {property.bathrooms}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Area</p>
              <p className="font-medium text-foreground">
                {property.area} Sq Ft
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-4 pt-2 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <span className="text-xs">Starting from</span>
          <p className="font-bold text-lg text-primary">
            ${property.price.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground">
              /mo
            </span>
          </p>
        </div>
        <Link
          href={`/properties/${property.id}`}
          className="text-sm font-medium bg-primary text-white hover:bg-primary px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
