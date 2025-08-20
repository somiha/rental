"use client";

import HeroSection from "./HeroSection";
import Search from "./Search";
import DiscoverSection from "./DiscoverSection";
import CardSection from "./CardSection";
import CallToActionSection from "./CallToActionSection";
import FeatureSection from "./FeatureSection";
import FooterSection from "./FooterSection";

const Page = () => {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <Search />
      <CardSection />
      <DiscoverSection />
      <FeatureSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
};
export default Page;
