"use client";

import { X, User, Utensils, Calendar, CreditCard, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function LedgerDrawer({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{student.studentName}</h2>
              <p className="text-xs text-gray-500 font-mono">ID: {student.studentId}</p>
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
          {/* Summary Box */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <p className="text-xs text-gray-500 font-medium">Department</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{student.department || "General"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Period</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{student.month} {student.year}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Meals</p>
              <p className="text-sm font-semibold text-green-700 mt-0.5">{student.items?.length || 0} Meals</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Ledger Amount</p>
              <p className="text-sm font-bold text-orange-600 mt-0.5">{formatCurrency(student.monthlyCost || 0)}</p>
            </div>
          </div>

          {/* Itemized Meal Register */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-500" />
              Itemized Daily Meal Register
            </h3>

            {student.items && student.items.length > 0 ? (
              <div className="space-y-2">
                {student.items.map((itemName, idx) => {
                  const price = student.itemPrices?.[itemName] || 0;
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-800 capitalize">{itemName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded">
                          Eat
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center">
                No active meal items registered today.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition"
          >
            Close Register
          </button>
        </div>
      </div>
    </div>
  );
}
