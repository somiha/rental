// components/ui/ButtonPrimary.tsx
"use client";

import { ButtonHTMLAttributes, FC } from "react";
import { cn } from "@/lib/utils"; // optional helper to merge class names

interface ButtonPrimaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const ButtonPrimary: FC<ButtonPrimaryProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        "bg-primary-500 hover:bg-primary-600 text-white whitespace-nowrap rounded-lg px-4 py-2 font-medium transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;
