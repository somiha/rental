"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Search } from "lucide-react";
import Fuse from "fuse.js";
import { bdLocations, Division, District, Upazilla } from "@/lib/locations";
import { PropertyType, SizeUnit, PropertyFormData } from "@/types/property";
const Mapview = dynamic(() => import("@/components/Mapview"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse"></div>
  ),
});

// Fuzzy matcher
const createFuzzyMatcher = (list: string[]) => {
  const fuse = new Fuse(list, { threshold: 0.3 });
  return (query: string) => {
    if (!query) return null;
    const result = fuse.search(query);
    return result[0]?.item || null;
  };
};

// Notification Component
const Notification = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg flex items-center justify-between min-w-[300px] z-50`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function AddPropertyPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<PropertyFormData>({
    defaultValues: {
      images: [] as File[],
      latitude: 23.8103,
      longitude: 90.4125,
      size: 0,
      sizeUnit: "sqft",
      parking: false,
      gasService: false,
      balcony: false,
      dining: false,
      drawing: false,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mapPosition, setMapPosition] = useState<[number, number]>([
    23.8103, 90.4125,
  ]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [pinPosition, setPinPosition] = useState<[number, number] | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const currentDivision = watch("division");
  const currentDistrict = watch("district");

  // Auto-detect user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setValue("latitude", latitude);
          setValue("longitude", longitude);
          setMapPosition([latitude, longitude]);
        },
        (err) => {
          console.warn(
            "Geolocation denied or failed, using default Dhaka",
            err
          );
        },
        { timeout: 10000 }
      );
    }
  }, [setValue]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const onSubmit = (data: PropertyFormData) => {
    console.log("Form submitted:", data);
    showNotification(
      "Your property has been successfully submitted.",
      "success"
    );
  };

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      setIsGeocoding(true);
      setValue("latitude", lat);
      setValue("longitude", lng);
      setMapPosition([lat, lng]);
      setPinPosition([lat, lng]);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
      );
      const data = await response.json();

      if (!data.address) {
        showNotification("Could not determine address.", "error");
        return;
      }

      const addr = data.address;
      setValue("address", data.display_name);

      // Normalize helper
      const norm = (str: string) =>
        str
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .trim();

      // Extract candidates
      const candidates = {
        state: addr.state || addr.province || "",
        city: addr.city || addr.town || addr.village || "",
        district: addr.district || addr.city_district || addr.county || "",
        suburb:
          addr.suburb ||
          addr.neighbourhood ||
          addr.hamlet ||
          addr.residential ||
          "",
      };

      let matchedDivision: Division | null = null;
      let matchedDistrict: District | null = null;
      let matchedUpazila: Upazilla | null = null;

      // === 1. Match Division ===
      for (const div of bdLocations.divisions) {
        if (
          norm(div.name) === norm(candidates.state) ||
          norm(div.name) === norm(candidates.city) ||
          norm(div.name_bn || "") === norm(candidates.state) ||
          norm(div.name_bn || "") === norm(candidates.city)
        ) {
          matchedDivision = div;
          setValue("division", div.name);
          break;
        }
      }

      // Fallback: fuzzy match division
      if (!matchedDivision && candidates.state) {
        const fuzzyName = createFuzzyMatcher(
          bdLocations.divisions.map((d) => d.name)
        )(candidates.state);
        matchedDivision =
          bdLocations.divisions.find((d) => d.name === fuzzyName) || null;
        if (matchedDivision) setValue("division", matchedDivision.name);
      }

      // If no division, reset and exit
      if (!matchedDivision) {
        resetField("division");
        resetField("district");
        resetField("upazilla");
        return;
      }

      // === 2. Match District ===
      // Try direct match
      for (const dist of matchedDivision.districts) {
        if (
          norm(dist.name) === norm(candidates.district) ||
          norm(dist.name) === norm(candidates.city) ||
          norm(dist.name_bn || "") === norm(candidates.district)
        ) {
          matchedDistrict = dist;
          setValue("district", dist.name);
          break;
        }
      }

      // If no match, try matching district from **suburb name** (e.g. Dumni → Gazipur)
      if (!matchedDistrict && candidates.suburb) {
        for (const dist of matchedDivision.districts) {
          // Check if any upazila in this district matches the suburb
          const hasMatchingUpazila = dist.upazilas.some(
            (upa) =>
              norm(upa.name) === norm(candidates.suburb) ||
              norm(upa.name_bn || "") === norm(candidates.suburb)
          );
          if (hasMatchingUpazila) {
            matchedDistrict = dist;
            setValue("district", dist.name);
            break;
          }
        }
      }

      // Fuzzy fallback for district
      if (!matchedDistrict && candidates.district) {
        const fuzzyDist = createFuzzyMatcher(
          matchedDivision.districts.map((d) => d.name)
        )(candidates.district);
        matchedDistrict =
          matchedDivision.districts.find((d) => d.name === fuzzyDist) || null;
        if (matchedDistrict) setValue("district", matchedDistrict.name);
      }

      // === 3. Match Upazila ===
      if (matchedDistrict && candidates.suburb) {
        for (const upa of matchedDistrict.upazilas) {
          if (
            norm(upa.name) === norm(candidates.suburb) ||
            norm(upa.name_bn || "") === norm(candidates.suburb)
          ) {
            matchedUpazila = upa;
            setValue("upazilla", upa.name);
            break;
          }
        }

        // Fuzzy fallback
        if (!matchedUpazila) {
          const fuzzyUpa = createFuzzyMatcher(
            matchedDistrict.upazilas.map((u) => u.name)
          )(candidates.suburb);
          const found = matchedDistrict.upazilas.find(
            (u) => u.name === fuzzyUpa
          );
          if (found) setValue("upazilla", found.name);
        }
      }

      // === 4. House & Road ===
      if (addr.house_number) setValue("houseNo", addr.house_number);
      if (addr.road) setValue("roadNo", addr.road);

      // Clear unmatched
      if (!matchedDistrict) resetField("district");
      if (!matchedUpazila) resetField("upazilla");
    } catch (error) {
      console.error("Geocoding error:", error);
      showNotification("Failed to fetch address details.", "error");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    if (files.length > 10) {
      showNotification("Max 10 images allowed.", "error");
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        showNotification(`${file.name} is not an image.`, "error");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        showNotification(`${file.name} > 5MB.`, "error");
        return false;
      }
      return true;
    });

    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    const dt = new DataTransfer();
    validFiles.forEach((file) => dt.items.add(file));
    setValue("images", Array.from(dt.files), { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);

    if (fileInputRef.current) {
      const dt = new DataTransfer();
      const files = fileInputRef.current.files;
      if (files) {
        Array.from(files).forEach((file, i) => {
          if (i !== index) dt.items.add(file);
        });
        fileInputRef.current.files = dt.files;
        setValue("images", Array.from(dt.files), { shouldValidate: true });
      }
    }
  };

  const propertyTypes: PropertyType[] = [
    "House",
    "Flat",
    "Building",
    "Restaurant",
    "Commercial",
  ];
  const sizeUnits: SizeUnit[] = ["sqft", "sqm", "katha", "bigha"];

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Map */}
      <div className="relative h-1/2 md:h-full md:w-1/2 bg-white order-1 md:order-none p-8">
        <Mapview
          data={[]}
          center={mapPosition}
          zoom={13}
          style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
          onClick={handleMapClick}
          pinPosition={pinPosition}
        />

        <div className="absolute bottom-4 left-8 right-8 bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="text-sm font-medium">Selected Location:</p>
          <p className="text-sm text-gray-600 truncate">
            {watch("address") || "Click on the map"}
          </p>
          {isGeocoding && (
            <p className="text-xs text-gray-500 mt-1">Fetching address...</p>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="overflow-y-auto p-6 bg-white border-t md:border-l border-gray-200 h-1/2 md:h-full md:w-1/2 order-2 md:order-none">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Add New Property</h1>
          <button className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1 ">
              Property Type <span className="text-red-500">*</span>
            </label>
            <Select
              onValueChange={(value: PropertyType) => setValue("type", value)}
              defaultValue="House"
            >
              <SelectTrigger className="border border-gray-300 focus:border-primary-500">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Property Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="The Grand Haven Residences & Suites"
              {...register("title", { required: "Required" })}
              className={errors.title ? "border-red-500" : "border-gray-300"}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search location..."
                value={watch("address") || ""}
                readOnly
                className="pl-10 border-gray-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Select
                  onValueChange={(value) => {
                    setValue("division", value);
                    setValue("district", undefined);
                    setValue("upazilla", undefined);
                  }}
                  value={currentDivision}
                >
                  <SelectTrigger className="border border-gray-300 focus:border-primary-500">
                    <SelectValue placeholder="Division" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {bdLocations.divisions.map((div: Division) => (
                      <SelectItem key={div.name} value={div.name}>
                        {div.name} ({div.name_bn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  onValueChange={(value) => {
                    setValue("district", value);
                    setValue("upazilla", undefined);
                  }}
                  value={currentDistrict}
                  disabled={!currentDivision}
                >
                  <SelectTrigger className="border border-gray-300 focus:border-primary-500">
                    <SelectValue placeholder="District" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {bdLocations.divisions
                      .find((div: Division) => div.name === currentDivision)
                      ?.districts.map((dist: District) => (
                        <SelectItem key={dist.name} value={dist.name}>
                          {dist.name} ({dist.name_bn})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  onValueChange={(value) => setValue("upazilla", value)}
                  disabled={!currentDistrict}
                >
                  <SelectTrigger className="border border-gray-300 focus:border-primary-500">
                    <SelectValue placeholder="Upazila" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {bdLocations.divisions
                      .find((div: Division) => div.name === currentDivision)
                      ?.districts.find(
                        (dist: District) => dist.name === currentDistrict
                      )
                      ?.upazilas.map((upa: Upazilla) => (
                        <SelectItem key={upa.name} value={upa.name}>
                          {upa.name} ({upa.name_bn})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* House & Road */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="House No."
                {...register("houseNo")}
                className="border-gray-300"
              />
              <Input
                placeholder="Road No."
                {...register("roadNo")}
                className="border-gray-300"
              />
            </div>

            {/* Lat/Lng */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Latitude"
                type="number"
                step="0.000001"
                {...register("latitude", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="border-gray-300"
              />
              <Input
                placeholder="Longitude"
                type="number"
                step="0.000001"
                {...register("longitude", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="border-gray-300"
              />
            </div>
          </div>

          {/* Size & Desc */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Add Description"
                {...register("description", { required: "Required" })}
                className={`min-h-[100px] ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Size <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Size"
                  type="number"
                  {...register("size", {
                    required: "Required",
                    valueAsNumber: true,
                  })}
                  className={errors.size ? "border-red-500" : "border-gray-300"}
                />
                <Select
                  onValueChange={(value: SizeUnit) =>
                    setValue("sizeUnit", value)
                  }
                  defaultValue="sqft"
                >
                  <SelectTrigger className="w-[100px] border border-gray-300 focus:border-primary-500">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {sizeUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.size && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.size.message}
                </p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium mb-2">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(
                [
                  "parking",
                  "gasService",
                  "balcony",
                  "dining",
                  "drawing",
                ] as const
              ).map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2">
                  <Checkbox {...register(amenity)} />
                  <span className="text-sm">
                    {amenity
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <p className="block text-sm font-medium mb-2">Images</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    width={100}
                    height={96}
                    className="w-full h-24 object-cover rounded border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {imagePreviews.length < 10 && (
                <div
                  className="border-2 border-dashed border-gray-300 flex items-center justify-center h-24 rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <div className="w-6 h-6 text-gray-400 mx-auto mb-1">+</div>
                    <p className="text-xs text-gray-500">Add Image</p>
                  </div>
                </div>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <p className="text-xs text-gray-500">Max 10 images (5MB each)</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
