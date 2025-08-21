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
      <div className="flex justify-between items-center w-full py-3 px-8 border-b border-gray-200 bg-green-gradient backdrop-blur-sm">
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            scroll={false}
          >
            {/* <Image
              src="/logo.svg"
              alt="Rentiful Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            /> */}
            <span>rentiful</span>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-8">
          <ul className="flex space-x-8 text-normal font-bold text-gray-700">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-gray-900 transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/signin">
            <Button
              variant="ghost"
              className="text-normal font-bold text-foreground-700 hover:text-foreground-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="text-normal font-bold bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow">
              sign up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
