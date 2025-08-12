"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DiscoverSection = () => {
  // Trigger animations on mount instead of whileInView to avoid hydration issues
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <section className="relative w-full bg-green-gradient overflow-hidden">
      {/* Background Image */}

      <AnimatePresence>
        {animate && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
            className="py-12 mb-16 relative z-10"
          >
            <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
              <motion.div
                variants={itemVariants}
                className="my-12 text-center text-white"
              >
                <h2 className="text-3xl font-semibold leading-tight">
                  Discover
                </h2>
                <p className="mt-4 text-lg text-primary-200">
                  Find your Dream Rental Property Today!
                </p>
                <p className="mt-2 max-w-3xl mx-auto text-primary-50">
                  Searching for your dream rental property has never been
                  easier. With our user-friendly search feature, you can quickly
                  find the perfect home that meets all your needs. Start your
                  search today and discover your dream rental property!
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 text-center">
                {[
                  {
                    imageSrc: "/landing-icon-wand.png",
                    title: "Search for Properties",
                    description:
                      "Browse through our extensive collection of rental properties in your desired location.",
                  },
                  {
                    imageSrc: "/landing-icon-calendar.png",
                    title: "Book Your Rental",
                    description:
                      "Once you've found the perfect rental property, easily book it online with just a few clicks.",
                  },
                  {
                    imageSrc: "/landing-icon-heart.png",
                    title: "Enjoy your New Home",
                    description:
                      "Move into your new rental property and start enjoying your dream home.",
                  },
                ].map((card, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <DiscoverCard {...card} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const DiscoverCard = ({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => (
  <div className="px-4 py-12 shadow-lg rounded-lg min-h-[18rem] md:h-72 bg-accent-100">
    <div className="bg-primary-700 p-[0.6rem] rounded-full mb-4 h-10 w-10 mx-auto">
      <Image
        src={imageSrc}
        width={30}
        height={30}
        className="w-full h-full"
        alt={title}
      />
    </div>
    <h3 className="mt-4 text-xl font-medium text-gray-800">{title}</h3>
    <p className="mt-2 text-base text-gray-500">{description}</p>
  </div>
);

export default DiscoverSection;
