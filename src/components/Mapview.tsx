"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Property } from "@/types/property";

// Default configuration constants
const DEFAULT_CENTER: [number, number] = [25.77, -80.18];
const DEFAULT_ZOOM = 13;
const DEFAULT_TILE_LAYER_URL =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

interface CustomMarkerCluster {
  getChildCount: () => number;
  getAllChildMarkers: () => L.Marker[];
}

const createClusterCustomIcon = (cluster: CustomMarkerCluster) => {
  return L.divIcon({
    html: `<span class="cluster-inner">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: L.point(40, 40, true),
  });
};

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Set default icon for all markers globally
L.Marker.prototype.options.icon = DefaultIcon;

// interface Apartment {
//   id: number;
//   position: [number, number];
//   name: string;
//   price: string;
//   image: string;
// }

interface MapViewProps {
  data: Property[]; // More generic name than "apartments"
  center?: [number, number];
  zoom?: number;
  tileLayerUrl?: string;
  markerIcon?: L.Icon;
  className?: string;
  style?: React.CSSProperties;
  renderPopup?: (item: Property) => React.ReactNode;
  clusterOptions?: {
    showCoverageOnHover?: boolean;
    zoomToBoundsOnClick?: boolean;
    spiderfyOnMaxZoom?: boolean;
    iconCreateFunction?: (cluster: CustomMarkerCluster) => L.DivIcon;
  };
}

const MapView = ({
  data,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  tileLayerUrl = DEFAULT_TILE_LAYER_URL,
  markerIcon = DefaultIcon,
  className = "",
  style = { height: "600px", width: "100%" },
  renderPopup,
  clusterOptions = {
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true,
    iconCreateFunction: createClusterCustomIcon,
  },
}: MapViewProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const defaultRenderPopup = (property: Property) => (
    <div className="w-[200px]">
      <div className="relative h-[120px] rounded-md overflow-hidden mb-2">
        <Image
          src={property.image}
          alt={property.name}
          width={200}
          height={120}
          className="object-cover"
          quality={80}
          priority={false}
        />
      </div>
      <h3 className="font-bold text-sm">{property.name}</h3>
      <p className="text-teal-600 mt-1 text-xs">{property.price}</p>
    </div>
  );

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className}
      style={style}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url={tileLayerUrl}
      />

      <MarkerClusterGroup {...clusterOptions}>
        {data.map((item) => (
          <Marker key={item.id} position={item.position} icon={markerIcon}>
            <Popup>
              {renderPopup ? renderPopup(item) : defaultRenderPopup(item)}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapView;
