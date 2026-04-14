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

export default function Middle() {
  return (
    <>
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
    </>
  );
}
