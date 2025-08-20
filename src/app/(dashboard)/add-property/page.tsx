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
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, X, Search } from "lucide-react";

const mapPinCursor = `url("data:image/svg+xml;utf8,
<svg xmlns='http://www.w3.org/2000/svg' fill='red' viewBox='0 0 24 24' width='24' height='24'>
  <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'/>
</svg>
") 12 24, auto`;

// Lazy load map
const MapView = dynamic(() => import("@/components/Mapview"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse"></div>
  ),
});

// ---------- Types ----------
type Division = "Dhaka" | "Chittagong" | "Sylhet" | "Rajshahi";
type District =
  | "Dhaka"
  | "Gazipur"
  | "Narayanganj"
  | "Chittagong"
  | "Cox's Bazar"
  | "Bandarban"
  | "Sylhet"
  | "Moulvibazar"
  | "Habiganj"
  | "Rajshahi"
  | "Bogra"
  | "Pabna";
type Upazilla =
  | "Dhanmondi"
  | "Gulshan"
  | "Mirpur"
  | "Gazipur Sadar"
  | "Kaliakair"
  | "Cox's Bazar Sadar"
  | "Teknaf";

const divisions: Division[] = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi"];
const districts: Record<Division, District[]> = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj"],
  Chittagong: ["Chittagong", "Cox's Bazar", "Bandarban"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj"],
  Rajshahi: ["Rajshahi", "Bogra", "Pabna"],
};
const upazillas: Record<District, Upazilla[]> = {
  Dhaka: ["Dhanmondi", "Gulshan", "Mirpur"],
  Gazipur: ["Gazipur Sadar", "Kaliakair"],
  "Cox's Bazar": ["Cox's Bazar Sadar", "Teknaf"],
  Narayanganj: [],
  Chittagong: [],
  Bandarban: [],
  Sylhet: [],
  Moulvibazar: [],
  Habiganj: [],
  Rajshahi: [],
  Bogra: [],
  Pabna: [],
};

const propertyTypes = [
  "House",
  "Flat",
  "Building",
  "Restaurant",
  "Commercial",
] as const;
type PropertyType = (typeof propertyTypes)[number];

const sizeUnits = ["sqft", "sqm", "katha", "bigha"] as const;
type SizeUnit = (typeof sizeUnits)[number];

interface PropertyFormData {
  title: string;
  type: PropertyType;
  division?: Division;
  district?: District;
  upazilla?: Upazilla;
  houseNo: string;
  roadNo: string;
  address?: string;
  latitude: number;
  longitude: number;
  size: number;
  sizeUnit: SizeUnit;
  description: string;
  parking: boolean;
  gasService: boolean;
  balcony: boolean;
  dining: boolean;
  drawing: boolean;
  images: File[];
}

// Notification component
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

// Custom pin icon component
const PinIcon = () => (
  <div className="relative">
    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
      <div className="w-4 h-4 bg-white rounded-full"></div>
    </div>
    <div className="w-2 h-4 bg-red-500 absolute bottom-[-4px] left-1/2 transform -translate-x-1/2"></div>
  </div>
);

// ---------- Page Component ----------
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
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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

  const normalize = (str: string) =>
    str.toLowerCase().replace(" division", "").replace(" district", "").trim();

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      setIsGeocoding(true);
      setValue("latitude", lat);
      setValue("longitude", lng);
      setMapPosition([lat, lng]);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      if (data.address) {
        const address = data.display_name || "";
        setValue("address", address);

        // -------- Find Division --------
        const divisionName =
          data.address.state || data.address.region || data.address.city;
        if (divisionName) {
          const foundDivision = divisions.find(
            (div) => normalize(div) === normalize(divisionName)
          );
          if (foundDivision) {
            setValue("division", foundDivision);

            // -------- Find District --------
            const districtName =
              data.address.county || data.address.city || data.address.town;
            if (districtName) {
              const foundDistrict = districts[foundDivision].find(
                (dist) => normalize(dist) === normalize(districtName)
              );
              if (foundDistrict) {
                setValue("district", foundDistrict);

                // -------- Find Upazilla / Area --------
                const upaName =
                  data.address.suburb ||
                  data.address.village ||
                  data.address.town;
                if (upaName) {
                  const foundUpa = upazillas[foundDistrict].find(
                    (upa) => normalize(upa) === normalize(upaName)
                  );
                  if (foundUpa) {
                    setValue("upazilla", foundUpa);
                  }
                }
              }
            }
          }
        }

        // House / Road
        if (data.address.house_number) {
          setValue("houseNo", data.address.house_number);
        }
        if (data.address.road) {
          setValue("roadNo", data.address.road);
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      showNotification(
        "Could not fetch address details for this location.",
        "error"
      );
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    if (files.length > 10) {
      showNotification("You can upload a maximum of 10 images.", "error");
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        showNotification(`${file.name} is not an image file.`, "error");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        showNotification(`${file.name} exceeds 5MB limit.`, "error");
        return false;
      }
      return true;
    });

    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    const newFileList = new DataTransfer();
    validFiles.forEach((file) => newFileList.items.add(file));
    setValue("images", Array.from(newFileList.files), { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);

    if (fileInputRef.current?.files) {
      const files = Array.from(fileInputRef.current.files);
      files.splice(index, 1);
      const newFileList = new DataTransfer();
      files.forEach((file) => newFileList.items.add(file));
      fileInputRef.current.files = newFileList.files;
      setValue("images", Array.from(newFileList.files), {
        shouldValidate: true,
      });
    }
  };

  // useEffect(() => {
  //   return () => {
  //     imagePreviews.forEach((url) => URL.revokeObjectURL(url));
  //   };
  // }, [imagePreviews]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  const currentDivision = watch("division");
  const currentDistrict = watch("district");

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

      {/* Mobile: Map on top */}
      <div className="relative h-1/2 md:h-full md:w-1/2 bg-gray-50 order-1 md:order-none">
        <MapView
          data={[]}
          center={mapPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          onClick={handleMapClick}
        />

        {/* Location Pin */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <PinIcon />
        </div>

        {/* Address Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6 bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="text-sm font-medium">Selected Location:</p>
          <p className="text-sm text-gray-600 truncate">
            {watch("address") || "Click on the map to select a location"}
          </p>
          {isGeocoding && (
            <p className="text-xs text-gray-500 mt-1">Fetching address...</p>
          )}
        </div>
      </div>

      {/* Form - Mobile: bottom, Desktop: right side */}
      <div className="overflow-y-auto p-6 bg-white border-t md:border-l border-gray-200 h-1/2 md:h-full md:w-1/2 order-2 md:order-none">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Add New Property</h1>
          <button className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Property Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="The Grand Haven Residences & Suites"
              {...register("title", { required: "Title is required" })}
              className={`border-gray-300 focus:border-primary-500 ${
                errors.title ? "border-red-500" : ""
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Property Type <span className="text-red-500">*</span>
            </label>
            <Select
              onValueChange={(value: PropertyType) => setValue("type", value)}
              defaultValue="House"
            >
              <SelectTrigger className="border-gray-300 focus:border-primary-500">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                  onValueChange={(value: Division) => {
                    setValue("division", value);
                    setValue("district", undefined);
                    setValue("upazilla", undefined);
                  }}
                  defaultValue=""
                >
                  <SelectTrigger className="border-gray-300 focus:border-primary-500">
                    <SelectValue placeholder="Division" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {divisions.map((div) => (
                      <SelectItem key={div} value={div}>
                        {div}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  onValueChange={(value: District) => {
                    setValue("district", value);
                    setValue("upazilla", undefined);
                  }}
                  disabled={!currentDivision}
                  defaultValue=""
                >
                  <SelectTrigger className="border-gray-300 focus:border-primary-500">
                    <SelectValue placeholder="District" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {currentDivision &&
                      districts[currentDivision].map((dist) => (
                        <SelectItem key={dist} value={dist}>
                          {dist}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  onValueChange={(value: Upazilla) =>
                    setValue("upazilla", value)
                  }
                  disabled={!currentDistrict}
                  defaultValue=""
                >
                  <SelectTrigger className="border-gray-300 focus:border-primary-500">
                    <SelectValue placeholder="Area/Upazilla" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {currentDistrict &&
                      upazillas[currentDistrict].map((upa) => (
                        <SelectItem key={upa} value={upa}>
                          {upa}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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

            <div className="grid grid-cols-2 gap-4 mb-4">
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

          {/* Property Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Property Size <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Size"
                  type="number"
                  {...register("size", {
                    required: "Size is required",
                    valueAsNumber: true,
                  })}
                  className={`border-gray-300 ${
                    errors.size ? "border-red-500" : ""
                  }`}
                />
                <Select
                  onValueChange={(value: SizeUnit) =>
                    setValue("sizeUnit", value)
                  }
                  defaultValue="sqft"
                >
                  <SelectTrigger className="w-[100px] border-gray-300">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
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

            <div>
              <label className="block text-sm font-medium mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Add Description"
                {...register("description", {
                  required: "Description is required",
                })}
                className={`border-gray-300 min-h-[100px] ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium mb-2">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2">
                <Checkbox id="parking" {...register("parking")} />
                <span className="text-sm">Parking</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox id="gas" {...register("gasService")} />
                <span className="text-sm">Gas Service</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox id="balcony" {...register("balcony")} />
                <span className="text-sm">Balcony</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox id="dining" {...register("dining")} />
                <span className="text-sm">Dining</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox id="drawing" {...register("drawing")} />
                <span className="text-sm">Drawing</span>
              </label>
            </div>
          </div>

          {/* Property Image */}
          <div>
            <p className="block text-sm font-medium mb-2">Property Images</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    <div className="w-6 h-6 text-gray-400 mx-auto mb-1 flex items-center justify-center">
                      <span className="text-xl">+</span>
                    </div>
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
            <Button type="button" variant="outline" className="border-gray-300">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              Submit Property
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
