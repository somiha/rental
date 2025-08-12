"use client";

import HeroSection from "./HeroSection";
import Search from "./Search";
import DiscoverSection from "./landing/DiscoverSection";

const Page = () => {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <Search />
      <DiscoverSection />
    </div>
  );
};
export default Page;
