import React, { useState } from "react";
import ButtonPrimary from "@/components/ButtonPrimary";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";

const features = [
  "2 Stories (6)",
  "Bike Path (1)",
  "Central Cooling (3)",
  "Central Heating (3)",
  "Dual Sinks (5)",
  "Electric Range (5)",
  "Emergency Exit (1)",
  "Fire Alarm (2)",
  "Fire Place (4)",
  "Home Theater (3)",
  "Jog Path (1)",
  "Laundry Room (3)",
  "Lawn (5)",
  "Marble Floors (5)",
  "Swimming Pool (4)",
];

const HeroSection = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  return (
    <section className="relative w-full bg-secondary-100">
      <div className="left-1/2 bottom-8 -translate-x-1/2 w-2/3 max-w-4xl rounded-lg border border-secondary-300 bg-secondary-50 shadow-lg dark:border-gray-700 dark:bg-gray-800 overflow-visible relative">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
            <Select>
              <SelectTrigger
                aria-label="Location"
                className="w-full bg-white/90 border-gray-300 dark:bg-gray-700/90 backdrop-blur-sm"
              >
                <SelectValue placeholder="All Main Locations" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 border-gray-400 dark:bg-gray-700/90 backdrop-blur-sm">
                <SelectItem
                  className="hover:bg-primary-600 hover:text-white"
                  value="all"
                >
                  All Main Locations
                </SelectItem>
                <SelectItem
                  className="hover:bg-primary-600 hover:text-white"
                  value="miami"
                >
                  Miami
                </SelectItem>
                <SelectItem
                  className="hover:bg-primary-600 hover:text-white"
                  value="miami_beach"
                >
                  Miami Beach
                </SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger
                aria-label="Type"
                className="w-full bg-white/90 border-gray-300 dark:bg-gray-700/90 backdrop-blur-sm"
              >
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 border-gray-400 dark:bg-gray-700/90 backdrop-blur-sm">
                <SelectItem
                  className="hover:bg-primary-600 hover:text-white"
                  value="all"
                >
                  All Types
                </SelectItem>
                <SelectItem
                  className="hover:bg-primary-600 hover:text-white"
                  value="residential"
                >
                  Residential
                </SelectItem>
                <SelectItem
                  className="hover:bg-primary-600 hover:text-white"
                  value="commercial"
                >
                  Commercial
                </SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger
                aria-label="Status"
                className="w-full bg-white/90 border-gray-300 dark:bg-gray-700/90 backdrop-blur-sm"
              >
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 border-gray-400 dark:bg-gray-700/90 backdrop-blur-sm">
                <SelectItem
                  className="hover:bg-primary-600 hover:text-white"
                  value="all"
                >
                  All
                </SelectItem>
                <SelectItem
                  className="hover:bg-primary-600 hover:text-white"
                  value="for_rent"
                >
                  For Rent
                </SelectItem>
                <SelectItem
                  className="hover:bg-primary-600 hover:text-white"
                  value="for_sale"
                >
                  For Sale
                </SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger
                aria-label="Beds"
                className="w-full bg-white/90 border-gray-300 dark:bg-gray-700/90 backdrop-blur-sm"
              >
                <SelectValue placeholder="All Beds" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 border-gray-400 dark:bg-gray-700/90 backdrop-blur-sm">
                <SelectItem
                  className="hover:bg-primary-600 hover:text-white"
                  value="all"
                >
                  All Beds
                </SelectItem>
                <SelectItem
                  className="hover:bg-primary-600 hover:text-white"
                  value="1"
                >
                  1+
                </SelectItem>
                <SelectItem
                  className="hover:bg-primary-600 hover:text-white"
                  value="2"
                >
                  2+
                </SelectItem>
                <SelectItem
                  className="hover:bg-primary-600 hover:text-white"
                  value="3"
                >
                  3+
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expand/Collapse and Search Buttons */}
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="link"
              size="sm"
              className="flex items-center gap-1 text-primary-600 dark:text-primary-400"
              onClick={() => {
                setShowAdvanced(!showAdvanced);
                setSearchExpanded(!searchExpanded);
              }}
            >
              {showAdvanced ? (
                <>
                  <ChevronUp size={16} />
                  Hide Search
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Advance Search
                </>
              )}
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 items-center max-w-lg w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Keyword"
                aria-label="Keyword"
                className="flex-grow bg-white/90 border-gray-300 dark:bg-gray-700/90 backdrop-blur-sm"
              />
              <ButtonPrimary type="submit">Search</ButtonPrimary>
            </div>
          </div>
        </div>

        {searchExpanded && (
          <div className="left-0 top-full mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-secondary-100 dark:bg-gray-700 shadow-lg p-4 relative overflow-visible">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
              <Select>
                <SelectTrigger
                  aria-label="Min Beds"
                  className="w-full bg-white/90 border-gray-300  dark:bg-gray-700/90 backdrop-blur-sm"
                >
                  <SelectValue placeholder="Min Beds" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 border-gray-400 dark:bg-gray-700/90 backdrop-blur-sm">
                  <SelectItem
                    className="hover:bg-primary-600 hover:text-white"
                    value="any"
                  >
                    Any
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-primary-600 hover:text-white"
                    value="1+"
                  >
                    1+
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-primary-600 hover:text-white"
                    value="2+"
                  >
                    2+
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger
                  aria-label="Min Baths"
                  className="w-full bg-white/90 border-gray-300  dark:bg-gray-700/90 backdrop-blur-sm"
                >
                  <SelectValue placeholder="Min Baths" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 border-gray-400 dark:bg-gray-700/90 backdrop-blur-sm">
                  <SelectItem
                    className="hover:bg-primary-600 hover:text-white"
                    value="any"
                  >
                    Any
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-primary-600 hover:text-white"
                    value="1+"
                  >
                    1+
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-primary-600 hover:text-white"
                    value="2+"
                  >
                    2+
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger
                  aria-label="Min Price"
                  className="w-full bg-white/90 border-gray-300  dark:bg-gray-700/90 backdrop-blur-sm"
                >
                  <SelectValue placeholder="Min Price" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 border-gray-400 dark:bg-gray-700/90 backdrop-blur-sm">
                  <SelectItem
                    className="hover:bg-primary-600 hover:text-white"
                    value="any"
                  >
                    Any
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-primary-600 hover:text-white"
                    value="$100,000+"
                  >
                    $100,000+
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-primary-600 hover:text-white"
                    value="$200,000+"
                  >
                    $200,000+
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger
                  aria-label="Max Price"
                  className="w-full bg-white/90 border-gray-300 dark:bg-gray-700/90 backdrop-blur-sm"
                >
                  <SelectValue placeholder="Max Price" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 border-gray-400 dark:bg-gray-700/90 backdrop-blur-sm">
                  <SelectItem
                    className="hover:bg-primary-600 hover:text-white"
                    value="any"
                  >
                    Any
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-primary-600 hover:text-white"
                    value="$500,000"
                  >
                    $500,000
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-primary-600 hover:text-white"
                    value="$1,000,000"
                  >
                    $1,000,000
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Looking for certain features
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {features.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
