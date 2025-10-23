"use client";

interface MaterialsDistributionProps {
  materialCounts: Record<string, number>;
  totalPoints: number;
}

const materialOptions = [
  "plastic",
  "glass",
  "electronics",
  "paper",
  "metal",
  "batteries",
];

export default function MaterialsDistribution({
  materialCounts,
  totalPoints,
}: MaterialsDistributionProps) {
  return (
    <section className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
      <h2 className="text-xl font-semibold mb-4">Materials Distribution</h2>
      <div className="space-y-3">
        {materialOptions.map((material) => {
          const count = materialCounts[material] || 0;
          const percentage = totalPoints > 0 ? (count / totalPoints) * 100 : 0;

          return (
            <div key={material} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-zinc-300 capitalize">
                  {material}
                </span>
                <span className="text-zinc-400">
                  {count} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
