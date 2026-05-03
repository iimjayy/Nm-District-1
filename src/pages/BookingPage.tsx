import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { events } from '../data';
import { buttonTap, staggerContainer, fadeInUp } from '../utils/motion';

interface BookingPageProps {
  eventId: string;
  initialStep: number;
  onNext: (tier?: string) => void;
  onComplete: () => void;
  onNavigate: (page: string) => void;
}

const steps = [
  { num: 1, label: 'Select Pass' },
  { num: 2, label: 'Details' },
  { num: 3, label: 'Payment' },
  { num: 4, label: 'Confirm' },
];

export default function BookingPage({ eventId, initialStep, onNext, onComplete, onNavigate }: BookingPageProps) {
  const event = events.find((e) => e.id === eventId);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  if (!event) return null;

  const handleNext = () => {
    if (currentStep === 1 && !selectedTier) return;
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      onNext(selectedTier || undefined);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Booking: {event.name}</h1>
          <p className="text-slate-400">{event.dateLabel} at {event.startsAt}</p>
        </motion.div>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <div className="flex justify-between mb-4">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                className="flex flex-col items-center gap-2"
                animate={{
                  scale: step.num === currentStep ? 1.1 : 1,
                }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step.num < currentStep
                      ? 'bg-purple-600 text-white'
                      : step.num === currentStep
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-950'
                        : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step.num < currentStep ? '✓' : step.num}
                </div>
                <span className="text-xs text-slate-400">{step.label}</span>
              </motion.div>
            ))}
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Select Your Pass</h2>
              <motion.div
                className="space-y-3"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {event.tiers?.map((tier) => (
                  <motion.button
                    key={tier.id}
                    {...fadeInUp}
                    onClick={() => setSelectedTier(tier.id)}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 20px 40px rgba(168, 85, 247, 0.2)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-6 rounded-xl text-left border-2 transition-all ${
                      selectedTier === tier.id
                        ? 'border-purple-600 bg-purple-600/10 ring-2 ring-purple-400'
                        : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold">{tier.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">₹{tier.price}</p>
                      </div>
                      {selectedTier === tier.id && (
                        <motion.div
                          className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 0.3 }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </div>
                    <div className="text-sm text-slate-300 space-y-1">
                      {tier.perks?.map((perk, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-purple-400">◆</span>
                          {perk}
                        </div>
                      ))}
                    </div>
                    <motion.div
                      className="mt-3 text-xs text-slate-400"
                      animate={{
                        opacity: [0.5, 1],
                        x: [0, 2, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                      }}
                    >
                      {tier.seats} seats available
                    </motion.div>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Your Details</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg outline-none focus:border-purple-600 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg outline-none focus:border-purple-600 transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg outline-none focus:border-purple-600 transition-colors"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Payment Method</h2>
              <div className="space-y-3">
                {['Credit Card', 'Debit Card', 'UPI', 'NetBanking'].map((method) => (
                  <motion.button
                    key={method}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 border border-slate-700 hover:border-purple-600 rounded-lg text-left transition-colors hover:bg-slate-800/50"
                  >
                    {method}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="space-y-4 text-center"
            >
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <div className="text-6xl mb-4">✓</div>
              </motion.div>
              <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
              <p className="text-slate-400">A confirmation email has been sent to {formData.email}</p>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mt-6">
                <div className="text-sm text-slate-400 mb-2">Booking ID</div>
                <div className="font-mono font-bold text-lg">NM{Date.now().toString().slice(-8).toUpperCase()}</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 mt-12"
        >
          {currentStep > 1 && (
            <motion.button
              {...buttonTap}
              onClick={handleBack}
              className="flex-1 py-3 border border-slate-700 hover:bg-slate-800 rounded-lg font-semibold transition-colors"
            >
              Back
            </motion.button>
          )}
          <motion.button
            {...buttonTap}
            onClick={handleNext}
            disabled={currentStep === 1 && !selectedTier}
            className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg font-semibold transition-colors"
          >
            {currentStep === 4 ? 'Done' : 'Next'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
