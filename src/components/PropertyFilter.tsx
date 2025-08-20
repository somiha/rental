import React from "react";
import { PropertyTypeFilterProps } from "@/types/property";

export function PropertyTypeFilter({ types }: PropertyTypeFilterProps) {
  return (
    <div className="space-y-3">
      {types.map((type, idx) => (
        <div key={idx} className="flex items-center">
          <input
            id={`type-${idx}`}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
          />
          <label
            htmlFor={`type-${idx}`}
            className="ml-3 text-sm font-medium text-gray-700"
          >
            {type}
          </label>
        </div>
      ))}
    </div>
  );
}
