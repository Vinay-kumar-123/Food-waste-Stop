"use client";

import { X, User, Utensils, Calendar, Receipt } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function LedgerDrawer({ student, sections = [], onClose }) {
  if (!student) return null;

  const dailyRegister = student.dailyRegister || [];

  // Compute section totals dynamically across all dynamic menu sections
  const sectionTotals = {};
  sections.forEach((sec) => {
    sectionTotals[sec] = 0;
  });

  dailyRegister.forEach((entry) => {
    const secStatus = entry.sections || {};
    sections.forEach((sec) => {
      if (secStatus[sec] === "Eat") {
        sectionTotals[sec] = (sectionTotals[sec] || 0) + 1;
      }
    });
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-orange-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{student.studentName}</h2>
              <p className="text-xs text-gray-500 font-mono">
                ID: {student.studentId} • {student.department || "General"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Monthly Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <p className="text-xs text-gray-500 font-medium">Month / Period</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {student.month} {student.year}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Department</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {student.department || "General"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Meals</p>
              <p className="text-sm font-semibold text-green-700 mt-0.5">
                {student.totalMeals} Meals
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Monthly Bill</p>
              <p className="text-sm font-bold text-orange-600 mt-0.5">
                {formatCurrency(student.monthlyBill || 0)}
              </p>
            </div>
          </div>

          {/* Dynamic Section Totals Bar */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Section Meal Totals
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {sections.map((sec) => (
                <div key={sec} className="bg-orange-50/50 border border-orange-100 p-2.5 rounded-lg text-center">
                  <p className="text-xs text-gray-600 font-medium">Total {sec}</p>
                  <p className="text-base font-bold text-orange-700 mt-0.5">
                    {sectionTotals[sec] || 0}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Daily Register Table */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Daily Meal Status Register
            </h3>

            {dailyRegister.length > 0 ? (
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 font-bold uppercase">
                        <th className="px-4 py-3">Date</th>
                        {sections.map((sec) => (
                          <th key={sec} className="px-3 py-3 text-center">
                            {sec}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-right">Daily Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dailyRegister.map((entry, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 font-medium text-gray-900 font-mono">
                            {entry.date}
                          </td>
                          {sections.map((sec) => {
                            const status = entry.sections?.[sec] || "N/A";
                            return (
                              <td key={sec} className="px-3 py-2.5 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded text-2xs font-semibold ${
                                    status === "Eat"
                                      ? "bg-green-100 text-green-700 border border-green-200"
                                      : status === "Skip"
                                      ? "bg-red-100 text-red-600 border border-red-200"
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  {status}
                                </span>
                              </td>
                            );
                          })}
                          <td className="px-4 py-2.5 text-right font-bold text-gray-900">
                            {formatCurrency(entry.dailyCost || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm">
                No daily meal records found for this period.
              </div>
            )}
          </div>
        </div>

        {/* Footer Summary Bar */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-semibold text-gray-700">
              Total Bill: <span className="text-orange-600 font-bold">{formatCurrency(student.monthlyBill || 0)}</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-lg transition"
          >
            Close Register
          </button>
        </div>
      </div>
    </div>
  );
}
