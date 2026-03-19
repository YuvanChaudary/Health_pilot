export default function MedicineCard({ name, cost, annualCost, description }) {
  return (
    <div className="bg-white border rounded-lg shadow p-4 w-full max-w-xs text-right">
      <h3 className="text-lg font-bold text-blue-700 mb-1">{name}</h3>

      {description && (
        <p className="text-sm text-gray-500 italic mb-2 text-left">
          {description}
        </p>
      )}

      <p className="text-sm text-gray-700">💰 Cost: ₹{cost ?? "N/A"}</p>
      <p className="text-sm text-gray-700">📆 Annual: ₹{annualCost ?? "N/A"}</p>
    </div>
  );
}
