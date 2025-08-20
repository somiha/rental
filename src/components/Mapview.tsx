"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import Image from "next/image";
import { Property } from "@/types/property";

const DEFAULT_CENTER: [number, number] = [23.8041, 90.4152];
const DEFAULT_ZOOM = 16;
const DEFAULT_TILE_LAYER_URL =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

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

// set default icon globally
L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  data: Property[];
  center?: [number, number];
  zoom?: number;
  tileLayerUrl?: string;
  markerIcon?: L.Icon;
  className?: string;
  style?: React.CSSProperties;
  renderPopup?: (item: Property) => React.ReactNode;
  onClick?: (lat: number, lng: number) => void;
}

function MapClickHandler({
  onClick,
}: {
  onClick?: (lat: number, lng: number) => void;
}) {
  useMapEvent("click", (e) => {
    if (onClick) onClick(e.latlng.lat, e.latlng.lng);
  });
  return null;
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
  onClick,
}: MapViewProps) => {
  const defaultRenderPopup = (property: Property) => (
    <div className="w-[200px]">
      <div className="relative h-[120px] rounded-md overflow-hidden mb-2">
        <Image
          src={property.image}
          alt={property.name}
          width={200}
          height={120}
          className="object-cover"
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

      <MarkerClusterGroup>
        {data.map((item) => (
          <Marker key={item.id} position={item.position} icon={markerIcon}>
            <Popup>
              {renderPopup ? renderPopup(item) : defaultRenderPopup(item)}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      <MapClickHandler onClick={onClick} />
    </MapContainer>
  );
};

export default MapView;
