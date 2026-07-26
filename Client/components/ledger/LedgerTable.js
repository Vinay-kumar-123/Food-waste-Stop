"use client";

import { Eye, Utensils, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function LedgerTable({ students = [], onSelectStudent }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs tracking-wider">
              <th className="px-6 py-3.5">Student Details</th>
              <th className="px-6 py-3.5">Department</th>
              <th className="px-6 py-3.5">Period</th>
              <th className="px-6 py-3.5 text-center">Total Meals</th>
              <th className="px-6 py-3.5 text-right">Monthly Bill</th>
              <th className="px-6 py-3.5 text-center">Monthly Register</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student, idx) => (
              <tr
                key={student.studentId || idx}
                className="hover:bg-orange-50/40 transition duration-150 group cursor-pointer"
                onClick={() => onSelectStudent(student)}
              >
                {/* Student Info */}
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900 group-hover:text-orange-600 transition">
                    {student.studentName}
                  </div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    ID: {student.studentId}
                  </div>
                </td>

                {/* Department */}
                <td className="px-6 py-4 text-gray-600 font-medium">
                  {student.department || "General"}
                </td>

                {/* Period */}
                <td className="px-6 py-4 text-gray-600">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {student.month} {student.year}
                  </span>
                </td>

                {/* Total Meals */}
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    <Utensils className="w-3 h-3" />
                    {student.totalMeals} Meals
                  </span>
                </td>

                {/* Monthly Bill */}
                <td className="px-6 py-4 text-right font-bold text-orange-600 text-base">
                  {formatCurrency(student.monthlyBill || 0)}
                </td>

                {/* View Action */}
                <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectStudent(student)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-100/60 rounded-lg transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Register
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
