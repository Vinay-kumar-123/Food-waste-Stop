export function ErrorState({ message = "An error occurred." }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
      {message}
    </div>
  );
}
