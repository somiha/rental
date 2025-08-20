// lib/schema.ts
import { z } from "zod";

const divisions = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi"] as const;
const districts = [
  "Dhaka",
  "Gazipur",
  "Narayanganj",
  "Chittagong",
  "Cox's Bazar",
  "Bandarban",
  "Sylhet",
  "Moulvibazar",
  "Habiganj",
  "Rajshahi",
  "Bogra",
  "Pabna",
] as const;
const upazillas = [
  "Dhanmondi",
  "Gulshan",
  "Mirpur",
  "Gazipur Sadar",
  "Kaliakair",
  "Cox's Bazar Sadar",
  "Teknaf",
] as const;
const propertyTypes = [
  "House",
  "Flat",
  "Building",
  "Restaurant",
  "Commercial",
] as const;
const sizeUnits = ["sqft", "sqm", "katha", "bigha"] as const;

export const propertyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(propertyTypes),
  division: z.enum(divisions).optional(),
  district: z.enum(districts).optional(),
  upazilla: z.enum(upazillas).optional(),
  houseNo: z.string().optional(),
  roadNo: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().finite(),
  longitude: z.number().finite(),
  size: z.number().positive("Size must be greater than 0"),
  sizeUnit: z.enum(sizeUnits),
  description: z.string().min(10, "Description must be at least 10 characters"),
  parking: z.boolean().default(false),
  gasService: z.boolean().default(false),
  balcony: z.boolean().default(false),
  dining: z.boolean().default(false),
  drawing: z.boolean().default(false),
  images: z
    .custom<FileList | null>((val) => val instanceof FileList || val === null)
    .refine((files) => !files || files.length <= 10, "Max 10 images allowed")
    .refine(
      (files) =>
        !files || Array.from(files).every((f) => f.size <= 5 * 1024 * 1024),
      "Each image must be ≤ 5MB"
    ),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;
