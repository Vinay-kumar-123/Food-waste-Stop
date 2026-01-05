import { cn } from "@/lib/utils";

export function Button({
  children,
  className = "",
  variant = "green-500",
  size = "md",
  ...props
}) {
  const variants = {
    primary: "bg-green-500 text-white hover:bg-green-600 active:bg-green-700",
    secondary:
      "bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700",
    outline:
      "border-2 border-bg-green-500 text-primary hover:bg-green-500/5 active:bg-green-500/10",
    ghost: "text-slate-900 hover:bg-gray-100 active:bg-gray-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        "font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}