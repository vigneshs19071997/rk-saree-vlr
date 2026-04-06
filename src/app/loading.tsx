// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#f0e8e0] border-t-[#8B1A4A] rounded-full animate-spin" />
        <p className="text-sm text-[#9e7b8a] animate-pulse">Loading Silk Drapes…</p>
      </div>
    </div>
  );
}
