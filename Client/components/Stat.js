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

export default function Stat() {
  return (
    <>
      <div className="bg-gray-100">
        {/* Stats Section */}
        <section className=" py-16 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-500 mb-2">
                  500+
                </div>
                <p className="text-gray-600">Organizations</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-500 mb-2">
                  50K+
                </div>
                <p className="text-gray-600">Students</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-500 mb-2">
                  10T+
                </div>
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
    </>
  );
}
