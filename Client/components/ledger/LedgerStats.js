"use client";

import { Users, Utensils, IndianRupee, Calculator, CalendarCheck } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

export function LedgerStats({ kpi }) {
  const stats = [
    {
      title: "Active Students",
      value: kpi?.activeStudents ?? 0,
      icon: Users,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "Total Meals Served",
      value: kpi?.totalMealsServed ?? 0,
      icon: Utensils,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(kpi?.monthlyRevenue ?? 0),
      icon: IndianRupee,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      title: "Avg. Student Bill",
      value: formatCurrency(kpi?.avgStudentBill ?? 0),
      icon: Calculator,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(kpi?.todayRevenue ?? 0),
      icon: CalendarCheck,
      color: "bg-teal-50 text-teal-600 border-teal-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card key={idx} className="border border-gray-200 shadow-sm">
            <CardBody className="p-4 flex items-center justify-between">
              <div>
                <p className="text-2xs font-bold text-gray-500 uppercase tracking-wider">
                  {stat.title}
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-xl border ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
