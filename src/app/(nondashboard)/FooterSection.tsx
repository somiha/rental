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
    <section className="bg-secondary-300 w-full relative">
      {" "}
      <footer className="border-t border-gray-700 py-16 text-gray-300">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
            {/* Brand */}
            <div className="mb-6 md:mb-0">
              <Link
                href="/"
                className="text-2xl font-extrabold tracking-widest text-primary hover:text-primary-600 transition-colors"
                scroll={false}
              >
                RENTIFUL
              </Link>
            </div>

            {/* Navigation */}
            <nav>
              <ul className="flex flex-wrap text-primary-600 justify-center gap-6 text-sm font-medium uppercase tracking-wide">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-primary transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-primary transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Social Icons */}
            <div className="flex space-x-6 text-xl">
              {[faFacebook, faInstagram, faTwitter, faLinkedin, faYoutube].map(
                (icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    aria-label="Social Link"
                    className="text-primary-500 hover:text-primary transition-colors hover:scale-110"
                  >
                    <FontAwesomeIcon icon={icon} />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Bottom small print */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-primary-500 border-t border-gray-700 pt-6">
            <span>© RENTIFUL. All rights reserved.</span>
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-primary transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default FooterSection;
