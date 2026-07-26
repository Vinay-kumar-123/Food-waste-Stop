export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center p-8 text-gray-500">
      <p>{message}</p>
    </div>
  );
}
