"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {Leaf} from "lucide-react";
import { Button } from "@/components/ui/Button";


export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white border-b border-gray-200 shadow-sm"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                WasteNot+
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden sm:flex gap-8">
              <a
                href="#features"
                className="text-foreground hover:text-green-500 transition"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-foreground hover:text-green-500 transition"
              >
                Pricing
              </a>
              {/* <Link
                href="/ngo"
                className="text-foreground hover:text-green-500 transition"
              >
                NGO Portal
              </Link> */}
            </nav>

            {/* Signup Buttons */}
            <div className="hidden sm:flex gap-8">
              <Link href="/Signup/student">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Student
                </Button>
              </Link>

              <Link href="/Signup/org">
                <Button variant="primary" size="sm" className="cursor-pointer">
                  Organization
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
