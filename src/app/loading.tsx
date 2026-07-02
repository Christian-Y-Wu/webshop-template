export default function Loading() {
  return (
    <div className="container-page py-10">
      <div className="skeleton h-[60vh] w-full rounded-[26px]" />
      <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton aspect-[4/5] w-full rounded-card" />
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
