"use client";

import HeroSection from "./../(landing)/HeroSection";
import Search from "./../(landing)/Search";
import PropertyListingPage from "./propertyList";

const Page = () => {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <Search />
      <PropertyListingPage />
    </div>
  );
};
export default Page;
