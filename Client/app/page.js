"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Leaf,
  Users,
  Utensils,
  TrendingDown,
  Heart,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className=" min-h-screen bg-white">
      {/* Header */}
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
              <span className="text-xl font-bold text-foreground hidden sm:inline">
                Food Not Waste
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
              <Link
                href="/ngo"
                className="text-foreground hover:text-green-500 transition"
              >
                NGO Portal
              </Link>
            </nav>

            {/* Signup Buttons */}
            <div className="flex gap-3">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-100 to-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Reduce Food Waste,{" "}
                <span className="text-green-500">Transform Communities</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Food Not Waste connects college messes, students, and NGOs to
                minimize food waste, maximize savings, and create social impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/Signup/student">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto cursor-pointer"
                  >
                    <Users className="w-5 h-5 mr-2 inline" />
                    Sign Up as Student
                  </Button>
                </Link>
                <Link href="/Signup/org">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto cursor-pointer"
                  >
                    <Utensils className="w-5 h-5 mr-2 inline" />
                    Sign Up as Organization
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-orange-500/10 rounded-3xl" />
                <div className="absolute inset-4 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Leaf className="w-24 h-24 text-green-500 mx-auto mb-4 opacity-20" />
                    <p className="text-gray-400">
                      Join the movement to reduce food waste
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
     <div className="bg-gray-100">
      {/* Stats Section */}
      <section className=" py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">500+</div>
              <p className="text-gray-600">Organizations</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">50K+</div>
              <p className="text-gray-600">Students</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">10T+</div>
              <p className="text-gray-600">Food Waste Reduced</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <h2 className="text-4xl font-bold text-foreground mb-16 text-center">
          Powerful Features for Everyone
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* For Organizations */}
          <Card className="border-2">
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  For Organizations
                </h3>
              </div>

              <ul className="space-y-3 text-gray-600">
                {[
                  "Upload and manage daily menus",
                  "Track student orders and preferences",
                  "View real-time statistics and analytics",
                  "AI-powered waste reduction insights",
                  "Mark leftover food for NGO donation",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* For Students */}
          <Card className="border-2">
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  For Students
                </h3>
              </div>

              <ul className="space-y-3 text-gray-600">
                {[
                  "View daily mess menus",
                  "Eat or skip dishes easily",
                  "Track your consumption",
                  "Personalized meal suggestions",
                  "Secure online payments",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </section>
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-16 text-center">
            Simple, Transparent Pricing
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Trial */}
            <Card>
              <CardBody className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    7-Day Free Trial
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Perfect for getting started
                  </p>
                </div>

                <ul className="space-y-3 text-gray-600">
                  {[
                    "Full access to all features",
                    "No credit card required",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="ghost" className="w-full">
                  Get Started <ArrowRight className="w-4 h-4 ml-2 inline" />
                </Button>
              </CardBody>
            </Card>

            {/* Premium */}
            <Card className="border-2 border-green-500">
              <CardBody className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-foreground">
                      Premium Plan
                    </h3>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">Unlock advanced features</p>
                </div>

                <div>
                  <p className="text-3xl font-bold text-foreground">
                    ₹1,500<span className="text-lg text-gray-600">/month</span>
                  </p>
                  <p className="text-sm text-gray-600">India</p>
                </div>


                <ul className="space-y-3 text-gray-600">
                  {[
                    "Advanced analytics",
                    "AI meal suggestions",
                    "Priority support",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="primary" className="w-full cursor-pointer">
                  Upgrade Now <ArrowRight className="w-4 h-4 ml-2 inline" />
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-green-300 to-orange-300 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of organizations and students working together to
            reduce food waste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/Signup/student">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10 cursor-pointer"
              >
                Get Started as Student
              </Button>
            </Link>
            <Link href="/Signup/org">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 cursor-pointer"
              >
                Get Started as Organization
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="font-bold">Food Not Waste</span>
              </div>
              <p className="text-gray-400">
                Reducing food waste, one meal at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <p className="text-center text-gray-400">
              © 2026 Food Not Waste. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
