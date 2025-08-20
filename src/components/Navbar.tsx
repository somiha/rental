import { NAVBAR_HEIGHT } from "@/lib/constants";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";

const Navbar = () => {
  const links = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Agents", href: "/agents" },
    { label: "Contact", href: "/contact" },
  ];
  return (
    <div
      className="fixed top-0 left-0 w-full shadow-xl z-100"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full py-3 px-8 bg-primary-700 text-white">
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="cursor-pointer hover:!text-primary-300"
            scroll={false}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Rentiful Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="text-2xl font-bold text-secondary-200 hover:text-accent-200">
                RENT
              </div>
              <span className="text-secondary-500 font-light hover:!text-primary-300"></span>
            </div>
          </Link>
        </div>
        <ul className="hidden md:flex space-x-6 text-primary-200">
          {links.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="cursor-pointer text-secondary-200 hover:text-accent-300 transition-colors duration-200"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-5">
          <Link href="/signin">
            <Button
              variant="outline"
              className="text-white border-accent-300 bg-transparent hover:bg-accent-200 hover:text-primary-800 rounded-lg"
            >
              Sign In
            </Button>
          </Link>

          <Link href="/signup">
            <Button
              variant="secondary"
              className="text-accent-800 border-white bg-secondary-300 hover:bg-accent-200 hover:text-primary-800 rounded-lg"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
