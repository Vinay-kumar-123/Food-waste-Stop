"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LedgerPagination({ pagination, onPageChange }) {
  if (!pagination) return null;

  const { currentPage = 1, pageSize = 10, totalStudents = 0, totalPages = 1 } = pagination;

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalStudents);

  return (
    <div className="bg-white px-4 py-3 border border-gray-200 rounded-xl flex items-center justify-between shadow-2xs">
      <div className="text-xs text-gray-500">
        Showing <span className="font-semibold text-gray-900">{startItem}</span> to{" "}
        <span className="font-semibold text-gray-900">{endItem}</span> of{" "}
        <span className="font-semibold text-gray-900">{totalStudents}</span> students
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-1 text-xs"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>

        <span className="text-xs text-gray-600 font-medium px-2">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1 text-xs"
        >
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
