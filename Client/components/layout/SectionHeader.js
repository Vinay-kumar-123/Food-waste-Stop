export function SectionHeader({ title, description, className = "" }) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  );
}
