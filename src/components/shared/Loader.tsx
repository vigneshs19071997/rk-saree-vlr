'use client';
// src/components/shared/Loader.tsx

interface LoaderProps {
  text?: string;
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loader({ text = 'Loading...', fullPage = false, size = 'md' }: LoaderProps) {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-[3px]' };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-[#f0e8e0] border-t-[#8B1A4A] rounded-full animate-spin`} />
      {text && <p className="text-sm text-[#9e7b8a] animate-pulse">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-cream/80 backdrop-blur-sm flex items-center justify-center z-[100]">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#f0e8e0]">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}
