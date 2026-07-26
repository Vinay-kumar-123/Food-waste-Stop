"use client";

import { FileSpreadsheet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LedgerEmptyState({ onResetFilters, message }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
      <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100">
        <FileSpreadsheet className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">No Ledger Records Found</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
        {message || "There are no student meal entries matching your search or period selection."}
      </p>
      {onResetFilters && (
        <Button
          variant="outline"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Reset Filters
        </Button>
      )}
    </div>
  );
}
