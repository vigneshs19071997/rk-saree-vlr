'use client';
// src/components/shared/OrderTracker.tsx
import { OrderStatus } from '@/types';
import { Package, Check, Clock, Truck, Home, Loader } from 'lucide-react';

interface TrackingStep {
  key: string;
  label: string;
  icon: React.ElementType;
}

const STEPS: TrackingStep[] = [
  { key: 'pending',          label: 'Order Placed',       icon: Package },
  { key: 'confirmed',        label: 'Confirmed',          icon: Check   },
  { key: 'processing',       label: 'Processing',         icon: Loader  },
  { key: 'shipped',          label: 'Shipped',            icon: Truck   },
  { key: 'out_for_delivery', label: 'Out for Delivery',   icon: Truck   },
  { key: 'delivered',        label: 'Delivered',          icon: Home    },
];

const STATUS_ORDER = [
  'pending', 'payment_received', 'confirmed', 'processing',
  'shipped', 'out_for_delivery', 'delivered',
];

interface Props {
  currentStatus: OrderStatus;
  estimatedDelivery?: string;
}

export default function OrderTracker({ currentStatus, estimatedDelivery }: Props) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  if (['cancelled', 'returned', 'return_requested', 'return_approved'].includes(currentStatus)) {
    return (
      <div className="flex items-center gap-3 p-4 bg-[#fdf8f3] rounded-2xl border border-[#f0e8e0]">
        <span className="text-2xl">
          {currentStatus === 'cancelled' ? '❌' : currentStatus === 'returned' ? '🔄' : '↩️'}
        </span>
        <div>
          <p className="font-medium text-[#3d1a2a] capitalize">{currentStatus.replace(/_/g, ' ')}</p>
          {currentStatus === 'return_requested' && (
            <p className="text-xs text-[#9e7b8a]">We'll review your request and get back to you.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start overflow-x-auto pb-2 gap-0">
        {STEPS.map((step, i) => {
          const stepIndex = STATUS_ORDER.indexOf(step.key);
          const isDone    = currentIndex > stepIndex;
          const isCurrent =
            STATUS_ORDER[currentIndex] === step.key ||
            (step.key === 'confirmed' && currentStatus === 'payment_received');
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center flex-1">
                {/* Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isDone    ? 'bg-[#8B1A4A] border-[#8B1A4A]'       : ''}
                    ${isCurrent ? 'bg-[#f7e8ef] border-[#8B1A4A] shadow-md shadow-[#8B1A4A]/20' : ''}
                    ${!isDone && !isCurrent ? 'bg-white border-[#e8d5db]' : ''}
                  `}
                >
                  {isDone ? (
                    <Check size={16} className="text-white" strokeWidth={2.5} />
                  ) : (
                    <Icon
                      size={17}
                      className={isCurrent ? 'text-[#8B1A4A]' : 'text-[#c9b3bc]'}
                    />
                  )}
                </div>
                {/* Label */}
                <p
                  className={`
                    text-[10px] mt-1.5 text-center leading-tight whitespace-nowrap font-medium
                    ${isCurrent || isDone ? 'text-[#8B1A4A]' : 'text-[#b89aa8]'}
                  `}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 mb-5 transition-all duration-500 ${isDone ? 'bg-[#8B1A4A]' : 'bg-[#f0e8e0]'}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {estimatedDelivery && (
        <p className="text-xs text-[#9e7b8a] text-center mt-3">
          Estimated delivery:{' '}
          <span className="font-semibold text-[#3d1a2a]">
            {new Date(estimatedDelivery).toLocaleDateString('en-IN', {
              weekday: 'long', day: 'numeric', month: 'long',
            })}
          </span>
        </p>
      )}
    </div>
  );
}
