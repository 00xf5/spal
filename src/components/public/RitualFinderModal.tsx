import React, { useState } from 'react';
import { Service } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, ArrowRight, CheckCircle2, RotateCcw, Clock, Sparkles } from 'lucide-react';

interface TreatmentMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
}

export const RitualFinderModal: React.FC<TreatmentMatchModalProps> = ({
  isOpen,
  onClose,
  services,
}) => {
  const { openBookingFlow } = useApp();
  const [step, setStep] = useState<number>(1);
  const [goal, setGoal] = useState<string>('tension');
  const [pressure, setPressure] = useState<string>('firm');
  const [duration, setDuration] = useState<string>('60');

  if (!isOpen) return null;

  const handleReset = () => {
    setStep(1);
    setGoal('tension');
    setPressure('firm');
    setDuration('60');
  };

  // Find matching service
  let recommendedService = services.find((s) => s.popular) || services[0];
  if (goal === 'scalp') {
    recommendedService = services.find((s) => s.name.toLowerCase().includes('head') || s.name.toLowerCase().includes('scalp')) || recommendedService;
  } else if (goal === 'skin') {
    recommendedService = services.find((s) => s.category_id === 'cat-facial') || recommendedService;
  } else if (goal === 'tension') {
    recommendedService = services.find((s) => s.name.toLowerCase().includes('stone') || s.name.toLowerCase().includes('deep')) || recommendedService;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-neutral-200 text-neutral-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl relative">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Treatment Advisor
            </span>
            <h3 className="font-serif text-xl font-bold text-neutral-900 mt-0.5">
              Find Your Ideal Treatment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 p-1 rounded-lg hover:bg-neutral-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              1. What is your primary wellness goal today?
            </label>
            <div className="space-y-2 text-xs">
              {[
                { id: 'tension', title: 'Deep Muscle Tension Relief', desc: 'Targeted knot release and back/shoulder focus' },
                { id: 'scalp', title: 'Mental Reset & Japanese Head Spa', desc: 'Warm water cascading waterfall & scalp massage' },
                { id: 'skin', title: 'Facial Rejuvenation & Lymphatic Flow', desc: 'Gua sha sculpting and organic botanical hydration' },
                { id: 'stress', title: 'Full-Body Relaxation & Thermal Warmth', desc: 'Gentle long strokes with heated Himalayan salt' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setGoal(opt.id)}
                  className={`w-full p-3 rounded-xl text-left border transition cursor-pointer flex items-center justify-between ${
                    goal === opt.id
                      ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div>
                    <strong className="text-neutral-900 block font-semibold">{opt.title}</strong>
                    <span className="text-neutral-500 text-[11px]">{opt.desc}</span>
                  </div>
                  {goal === opt.id && <CheckCircle2 className="w-4 h-4 text-neutral-900" />}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              2. What pressure and session length do you prefer?
            </label>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-neutral-600 block mb-1.5 font-medium">Pressure Preference:</span>
                <div className="grid grid-cols-3 gap-2">
                  {['Light Gentle', 'Medium Restorative', 'Firm Deep Tissue'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPressure(p)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                        pressure === p
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-neutral-600 block mb-1.5 font-medium">Duration:</span>
                <div className="grid grid-cols-3 gap-2">
                  {['45 min', '60 min', '75-90 min'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                        duration === d
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-medium hover:bg-neutral-50 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View Recommendation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white px-2 py-0.5 rounded">
                  Recommended Match
                </span>
                <span className="font-serif font-bold text-lg text-neutral-900">
                  ${recommendedService.price}
                </span>
              </div>

              <div>
                <h4 className="font-serif text-lg font-bold text-neutral-900">
                  {recommendedService.name}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-light mt-1">
                  {recommendedService.description}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-neutral-700 pt-1 font-medium">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{recommendedService.duration_min} minutes</span>
                </div>
                <span>•</span>
                <span>Includes Consultation</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-3.5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-medium hover:bg-neutral-50 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  openBookingFlow(recommendedService);
                }}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Book This Treatment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
