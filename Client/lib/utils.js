export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

export function generateId(prefix = "") {
  return `${prefix}${Date.now().toString().slice(-8)}`;
}