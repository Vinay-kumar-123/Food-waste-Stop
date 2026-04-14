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

export default function PriceSection() {
  return (
    <>
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
                    ₹1099<span className="text-lg text-gray-600">/month</span>
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
    </>
  );
}
