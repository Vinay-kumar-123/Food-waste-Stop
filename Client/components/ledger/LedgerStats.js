"use client";

import { Users, Utensils, IndianRupee, Calculator } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

export function LedgerStats({ totalStudents, totalMeals, totalAmount, avgCostPerStudent }) {
  const stats = [
    {
      title: "Active Students",
      value: totalStudents,
      icon: Users,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "Total Meals Served",
      value: totalMeals,
      icon: Utensils,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      title: "Total Ledger Revenue",
      value: formatCurrency(totalAmount),
      icon: IndianRupee,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      title: "Avg. Cost / Student",
      value: formatCurrency(avgCostPerStudent),
      icon: Calculator,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card key={idx} className="border border-gray-200 shadow-sm">
            <CardBody className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl border ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
