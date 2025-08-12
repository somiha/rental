"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MapViewWrapper from "./MapViewWrapper";
import { Position, Property } from "@/types/property";
import { properties } from "@/data/properties";

interface MapModalProps {
  address: string;
  position: Position;
  children?: React.ReactNode;
}

export default function MapModal({
  address,
  position,
  children,
}: MapModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <span className="hover:underline cursor-pointer">{address}</span>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Property Location</DialogTitle>
        </DialogHeader>
        <div className="h-[600px]">
          <MapViewWrapper
            data={[
              properties.find((p) => p.position === position) ||
                ({} as Property),
            ]}
            center={position}
            zoom={15}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{address}</p>
      </DialogContent>
    </Dialog>
  );
}
