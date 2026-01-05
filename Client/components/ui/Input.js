import { cn } from "@/lib/utils";

export function Input({ className = "", label = "", error = "", ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-2 border border-gray-300 rounded-lg",
          "focus:ring-2 focus:ring-primary focus:border-transparent outline-none",
          "transition duration-200",
          error && "border-red-500 focus:ring-red-500",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}