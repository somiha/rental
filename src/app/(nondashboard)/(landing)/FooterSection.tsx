import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const FooterSection = () => {
  return (
    <footer className="border-t border-gray-300 py-8 text-gray-700 w-2/3">
      {/* Airbnb-Exact Side Spacing */}
      <div className="px-[2px] sm:px-[24px] lg:px-[4px] max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-12">
          {/* Left Side: Brand + Nav */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 w-full md:w-auto">
            {/* Brand */}
            <div>
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight text-primary-700 hover:text-primary-800 transition-colors"
                scroll={false}
              >
                rentiful
              </Link>
            </div>

            {/* Navigation Links - Compact, inline, left-aligned */}
            <nav>
              <ul className="flex flex-wrap gap-x-2 gap-y-2 text-sm text-gray-600 font-normal">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary-700 transition-colors duration-200"
                  >
                    about
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary-700 transition-colors duration-200"
                  >
                    contact us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-primary-700 transition-colors duration-200"
                  >
                    help center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-primary-700 transition-colors duration-200"
                  >
                    terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary-700 transition-colors duration-200"
                  >
                    privacy
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Social Icons - Right Side */}
          <div className="flex space-x-5 text-lg">
            {[faFacebook, faInstagram, faTwitter, faLinkedin, faYoutube].map(
              (icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label="Social Link"
                  className="text-gray-500 hover:text-primary-700 transition-colors duration-200 hover:scale-105"
                >
                  <FontAwesomeIcon icon={icon} />
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
