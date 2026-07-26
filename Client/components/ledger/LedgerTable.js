"use client";

import { Eye, Utensils } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function LedgerTable({ students, onSelectStudent }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs tracking-wider">
              <th className="px-6 py-3.5">Student Details</th>
              <th className="px-6 py-3.5">Department / Year</th>
              <th className="px-6 py-3.5">Period</th>
              <th className="px-6 py-3.5">Meal Register Status</th>
              <th className="px-6 py-3.5 text-right">Daily Cost</th>
              <th className="px-6 py-3.5 text-right">Monthly Total</th>
              <th className="px-6 py-3.5 text-center">Action</th>
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

                {/* Department / Year */}
                <td className="px-6 py-4 text-gray-600">
                  <div>{student.department || "General"}</div>
                  <div className="text-xs text-gray-400">Year {student.year || "2026"}</div>
                </td>

                {/* Period */}
                <td className="px-6 py-4 text-gray-600">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {student.month} {student.year}
                  </span>
                </td>

                {/* Meal Register Status */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {student.items && student.items.length > 0 ? (
                      student.items.map((item, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200"
                        >
                          <Utensils className="w-3 h-3" />
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">No meals selected</span>
                    )}
                  </div>
                </td>

                {/* Daily Cost */}
                <td className="px-6 py-4 text-right font-medium text-gray-900">
                  {formatCurrency(student.dailyCost || 0)}
                </td>

                {/* Monthly Total */}
                <td className="px-6 py-4 text-right font-bold text-green-700">
                  {formatCurrency(student.monthlyCost || 0)}
                </td>

                {/* View Action */}
                <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectStudent(student)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-100/60 rounded-lg transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Details
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
