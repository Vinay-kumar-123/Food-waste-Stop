"use client";

import { Loader2 } from "lucide-react";

export function LedgerLoadingState({ message = "Fetching student meal ledger records..." }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
      <p className="text-gray-700 font-semibold">{message}</p>
      <p className="text-xs text-gray-400 mt-1">Connecting to production backend services...</p>
    </div>
  );
}
