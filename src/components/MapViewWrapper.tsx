"use client";

import dynamic from "next/dynamic";
import { Position, Property } from "@/types/property";

const MapView = dynamic(() => import("./Mapview"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-100 flex items-center justify-center">
      Loading map...
    </div>
  ),
});

interface MapViewWrapperProps {
  data: Property[];
  center?: Position;
  zoom?: number;
}

export default function MapViewWrapper({
  data,
  center,
  zoom,
}: MapViewWrapperProps) {
  return <MapView data={data} center={center} zoom={zoom} />;
}
