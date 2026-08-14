import React from 'react';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SpaPackage {
  id: string;
  name: string;
  duration: string;
  price: number;
  savings: string;
  description: string;
  inclusions: string[];
  popular?: boolean;
}

const SPA_PACKAGES: SpaPackage[] = [
  {
    id: 'pkg-renewal',
    name: 'Head-to-Toe Restoration Package',
    duration: '2.5 Hours',
    price: 320,
    savings: 'Save $55',
    description: 'Our most comprehensive package combining Japanese scalp hydrotherapy, customized deep tissue massage, and express hydration facial.',
    inclusions: [
      '60-Min Japanese Waterfall Scalp Therapy',
      '60-Min Deep Tissue Muscle Release',
      '30-Min Rose Quartz Express Facial',
      'Complimentary Botanical Tea Service',
    ],
    popular: true,
  },
  {
    id: 'pkg-thermal',
    name: 'Thermal Recovery & Detox Package',
    duration: '2 Hours',
    price: 260,
    savings: 'Save $40',
    description: 'Designed for deep muscular recovery and respiratory clearing through mineral thermal heat and targeted trigger point therapy.',
    inclusions: [
      '75-Min Himalayan Salt Stone Bodywork',
      '30-Min Private Infrared Cedar Sauna Session',
      'Eucalyptus & Mineral Hydration Mist',
      'Lounge Access & Herbal Tea',
    ],
  },
  {
    id: 'pkg-couples',
    name: 'Couples Private Suite Retreat',
    duration: '2 Hours',
    price: 450,
    savings: 'Save $70',
    description: 'Side-by-side restorative massages in our private twin hydrotherapy suite with complimentary organic tea and lounge amenities.',
    inclusions: [
      '75-Min Side-by-Side Custom Massages',
      '30-Min Private Hinoki Soaking Tub Access',
      'Aromatherapy Scalp & Foot Treatments',
      'Private Suite Refreshments & Organic Tea',
    ],
  },
];

export const PackagesCarousel: React.FC = () => {
  const { openBookingFlow } = useApp();

  return (
    <section id="spa-packages-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Curated Bundles
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
            Featured Spa & Wellness Packages
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SPA_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white border rounded-2xl p-6 flex flex-col justify-between space-y-5 transition shadow-sm ${
              pkg.popular
                ? 'border-neutral-900 ring-1 ring-neutral-900'
                : 'border-neutral-200 hover:border-neutral-400'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  {pkg.popular && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white px-2 py-0.5 rounded inline-block mb-1.5">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    {pkg.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-neutral-900">${pkg.price}</span>
                <span className="text-xs text-neutral-500">• {pkg.duration}</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {pkg.savings}
                </span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                {pkg.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <span className="text-[11px] font-semibold text-neutral-700 block uppercase tracking-wider">
                  Package Inclusions:
                </span>
                {pkg.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-neutral-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 flex-shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => openBookingFlow()}
              className={`w-full py-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                pkg.popular
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
              }`}
            >
              <span>Book This Package</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
