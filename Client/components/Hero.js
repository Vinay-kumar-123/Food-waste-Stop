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

export default function Hero() {
  return (
    <>
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
    </>
  );
}
