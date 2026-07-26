export function EmptyState({ message = "No items found." }) {
  return (
    <div className="p-6 text-center text-gray-500 text-sm">
      {message}
    </div>
  );
}
