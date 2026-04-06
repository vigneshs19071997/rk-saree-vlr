'use client';
// src/components/customer/PaymentModal.tsx
import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Copy, Check, Clock, ShieldCheck } from 'lucide-react';

interface Props {
  order: { _id: string; orderNumber: string; total: number };
  onClose: () => void;
  onComplete: () => void;
}

interface PaymentInfo {
  adminUpiId: string;
  adminUpiName: string;
  qrDataUrl: string;
}

export default function PaymentModal({ order, onClose, onComplete }: Props) {
  const [tab, setTab] = useState<'qr' | 'upi'>('qr');
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [utrInput, setUtrInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timer, setTimer] = useState(600); // 10 min

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    axios.get(`/api/payment?amount=${order.total}`).then(({ data }) => setPaymentInfo(data));
  }, [order.total]);

  useEffect(() => {
    const t = setInterval(() => setTimer((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const copyUpi = () => {
    navigator.clipboard.writeText(paymentInfo?.adminUpiId || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('UPI ID copied!');
  };

  const handleConfirmPayment = async () => {
    setSubmitting(true);
    try {
      await axios.patch(`/api/orders/${order._id}`, {
        action: 'confirmPayment',
        paymentTransactionId: utrInput,
      });
      setSubmitted(true);
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally { setSubmitting(false); }
  };

  const mins = Math.floor(timer / 60).toString().padStart(2, '0');
  const secs = (timer % 60).toString().padStart(2, '0');

  return (
    /* Full-screen overlay — flex centered, safe padding on all sides */
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/*
        Modal card:
        - mobile: slides up from bottom (rounded top only), max-height 92dvh
        - desktop: centered, max-w-md, rounded all sides, max-height 90vh
        - flex column so header stays fixed and body scrolls independently
      */}
      <div className="
        relative w-full sm:max-w-md
        bg-white
        rounded-t-3xl sm:rounded-3xl
        shadow-2xl
        animate-scaleIn
        flex flex-col
        max-h-[92dvh] sm:max-h-[90vh]
        overflow-hidden
      ">

        {/* ── Sticky header (never scrolls away) ─────────────────────── */}
        <div className="bg-gradient-to-r from-[#8B1A4A] to-[#C0426E] p-5 text-white flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-display text-xl">Complete Payment</h2>
              <p className="text-white/70 text-sm">Order #{order.orderNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0">
              <X size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-2xl font-bold">₹{order.total.toLocaleString('en-IN')}</span>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${timer < 60 ? 'bg-red-500/30 text-red-100' : 'bg-white/20'}`}>
              <Clock size={14} /> {mins}:{secs}
            </div>
          </div>
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────── */}
        {!submitted ? (
          <div className="overflow-y-auto flex-1 overscroll-contain">
            <div className="p-5 space-y-5">

              {/* Tabs */}
              <div className="flex gap-1 bg-[#fdf8f3] rounded-xl p-1">
                {([['qr', '📱 Scan QR'], ['upi', '💳 UPI ID']] as const).map(([t, label]) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-white text-[#8B1A4A] shadow-sm' : 'text-[#9e7b8a] hover:text-[#3d1a2a]'}`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* QR tab */}
              {tab === 'qr' && (
                <div className="text-center">
                  <p className="text-sm text-[#9e7b8a] mb-4">Scan with PhonePe, GPay, Paytm or any UPI app</p>
                  {paymentInfo?.qrDataUrl ? (
                    <div className="inline-block p-3 bg-[#fdf8f3] rounded-2xl border border-[#f0e8e0] mb-4">
                      <Image
                        src={paymentInfo.qrDataUrl}
                        alt="UPI QR Code"
                        width={200}
                        height={200}
                        className="rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="w-52 h-52 mx-auto shimmer rounded-2xl mb-4" />
                  )}
                  <div className="flex items-center justify-center gap-2 bg-[#fdf8f3] rounded-xl px-4 py-3">
                    <span className="font-mono text-[#3d1a2a] font-semibold text-sm break-all">
                      {paymentInfo?.adminUpiId}
                    </span>
                    <button onClick={copyUpi} className="text-[#8B1A4A] flex-shrink-0">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* UPI ID tab */}
              {tab === 'upi' && (
                <div className="bg-[#fdf8f3] rounded-xl p-4">
                  <p className="text-xs text-[#9e7b8a] mb-2">Pay to this UPI ID</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono font-bold text-[#3d1a2a] text-sm break-all">
                      {paymentInfo?.adminUpiId}
                    </span>
                    <button onClick={copyUpi}
                      className="flex items-center gap-1 text-sm text-[#8B1A4A] border border-[#8B1A4A] px-3 py-1.5 rounded-lg hover:bg-[#f7e8ef] flex-shrink-0">
                      {copied ? <Check size={14} /> : <Copy size={14} />} Copy
                    </button>
                  </div>
                  <p className="text-xs text-[#9e7b8a] mt-2">Name: {paymentInfo?.adminUpiName}</p>
                  <p className="text-xs text-[#9e7b8a]">
                    Amount: <strong className="text-[#8B1A4A]">₹{order.total.toLocaleString('en-IN')}</strong>
                  </p>
                </div>
              )}

              {/* Steps */}
              <div className="space-y-2">
                {[
                  'Open your UPI app',
                  `Send ₹${order.total.toLocaleString('en-IN')} to ${paymentInfo?.adminUpiId || 'our UPI ID'}`,
                  'Copy the UTR / transaction ID from your app',
                  'Enter it below and confirm',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-[#6b4d57]">
                    <span className="w-5 h-5 rounded-full bg-[#f7e8ef] text-[#8B1A4A] text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                      {i + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>

              {/* UTR input */}
              <div>
                <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">
                  UTR / Transaction Reference <span className="text-[#b89aa8]">(optional)</span>
                </label>
                <input
                  type="text"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  placeholder="e.g. 421234567890"
                  className="input-field font-mono"
                />
              </div>

              {/* Confirm button */}
              <button
                onClick={handleConfirmPayment}
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : "✅ I've Completed the Payment"}
              </button>

              {/* Security note */}
              <p className="text-center text-xs text-[#b89aa8]">
                🔒 Your transaction is secured and verified manually by our team.
              </p>
            </div>
          </div>
        ) : (
          /* ── Success state ──────────────────────────────────────────── */
          <div className="p-8 text-center animate-scaleIn overflow-y-auto flex-1">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShieldCheck size={40} className="text-green-600" />
            </div>
            <h3 className="text-xl font-display text-[#3d1a2a] mb-3">Payment Submitted!</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-left">
              <p className="text-sm text-amber-800 font-medium mb-1">⏳ Awaiting Confirmation</p>
              <p className="text-sm text-amber-700">
                Once the amount is received, we will confirm your order and send a confirmation email to you.
              </p>
            </div>
            <p className="text-xs text-[#9e7b8a] mb-5">
              Order #{order.orderNumber} · ₹{order.total.toLocaleString('en-IN')}
            </p>
            <button onClick={onComplete} className="btn-primary w-full">
              View My Order →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
