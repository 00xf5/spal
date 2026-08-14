import React from 'react';
import { Sparkles, Calendar, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TreatmentJourneyCarousel: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Consultation & Intake',
      subtitle: 'Health & Preference Check',
      description: 'Your therapist reviews your medical history, pressure preferences, and areas of tension to tailor the session to your goals.',
      highlight: 'Complimentary herbal tea & intake check',
    },
    {
      number: '02',
      title: 'Customized Treatment',
      subtitle: 'Clinical & Restorative Care',
      description: 'Experience your selected therapy in private climate-controlled rooms with heated massage tables and botanical aromatherapy.',
      highlight: 'Continuous comfort adjustments',
    },
    {
      number: '03',
      title: 'Relaxation Lounge',
      subtitle: 'Post-Session Recovery',
      description: 'Transition smoothly back to your day in our quiet lounge with infused hydration, calming soundscapes, and fresh towels.',
      highlight: 'No rush, private rest time',
    },
    {
      number: '04',
      title: 'Home Care Guidance',
      subtitle: 'Post-Care Recommendations',
      description: 'Your therapist provides personalized stretching guidance, posture tips, and botanical skincare recommendations.',
      highlight: 'Saved to your digital client portal',
    },
  ];

  return (
    <section id="treatment-journey-section" className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2 pb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          The Guest Experience
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
          What to Expect During Your Visit
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600">
          A seamless, professional care journey designed for complete relaxation from arrival to departure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:border-neutral-400 transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-neutral-300">
                  {step.number}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                  Stage {idx + 1}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  {step.title}
                </h3>
                <span className="text-xs text-neutral-500 block">{step.subtitle}</span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                {step.description}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-medium text-neutral-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 flex-shrink-0" />
              <span>{step.highlight}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
