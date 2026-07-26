"use client";

import Link from "next/link";
import { ArrowLeft, Download, Receipt } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LedgerHeader({ orgName, onExport, exporting }) {
  return (
    <div className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/Dashboard/admin"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Student Meal Ledger</h1>
              <p className="text-sm text-gray-500">{orgName || "Organization"} • Monthly Register</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onExport}
            disabled={exporting}
            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? "Exporting..." : "Export CSV"}
          </Button>
        </div>
      </div>
    </div>
  );
}
