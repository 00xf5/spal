import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Thermometer, Wind, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TreatmentSpace {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  temp: string;
  humidity: string;
  aroma: string;
  acoustics: string;
  highlights: string[];
  capacity: string;
}

const TREATMENT_SPACES: TreatmentSpace[] = [
  {
    id: 'space-hydro',
    name: 'Japanese Hydrotherapy & Head Spa Suite',
    subtitle: 'Scalp Therapy & Waterfall Basin Chamber',
    description: 'Designed with aromatic Hinoki wood fixtures and ergonomic hydrotherapy basins featuring temperature-controlled rainfall halos, steam domes, and shiatsu neck supports.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
    temp: '38°C (100°F)',
    humidity: '65% Mist',
    aroma: 'Hinoki Cypress, Bergamot & Sweet Orange',
    acoustics: 'Continuous Raindrop Acoustic Flow',
    highlights: ['Micro-bubble oxygen rainfall halo', 'Ergonomic neck support basins', 'Warm steam herbal infusion'],
    capacity: 'Individual or Private Duo',
  },
  {
    id: 'space-sauna',
    name: 'Himalayan Salt & Cedar Sauna',
    subtitle: 'Infrared & Mineral Recovery Suite',
    description: 'Constructed with backlit natural Himalayan salt rock and dry cedar wood to promote muscle recovery, respiratory clearing, and soothing thermal circulation.',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85',
    temp: '65°C (149°F)',
    humidity: '20% Dry Thermal',
    aroma: 'Cedarwood & Pine',
    acoustics: 'Deep Harmonic Relaxation Audio',
    highlights: ['Natural mineral air ionization', 'Far-infrared radiant panels', 'Eucalyptus hydration station'],
    capacity: 'Up to 4 Guests',
  },
  {
    id: 'space-tea',
    name: 'Relaxation & Tea Lounge',
    subtitle: 'Post-Treatment Decompression Atrium',
    description: 'A serene lounge overlooking our indoor greenery where guests can enjoy complimentary organic herbal teas, infused waters, and comfortable quiet seating before or after treatments.',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85',
    temp: '22°C (72°F)',
    humidity: '45% Fresh Filtered Air',
    aroma: 'White Tea & Lemongrass',
    acoustics: 'Acoustic Harp & Ambient Water',
    highlights: ['Complimentary organic loose-leaf tea bar', 'Cashmere throws and plush seating', 'Silent relaxation zone'],
    capacity: 'Open to All Guests',
  },
];

export const SanctuarySpacesCarousel: React.FC = () => {
  const { openBookingFlow } = useApp();
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const space = TREATMENT_SPACES[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + TREATMENT_SPACES.length) % TREATMENT_SPACES.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % TREATMENT_SPACES.length);
  };

  return (
    <section id="treatment-facilities-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Our Facilities
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
            Treatment Suites & Relaxation Spaces
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {TREATMENT_SPACES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeIdx === idx
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {s.name.split(' ')[0]} {s.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {space.subtitle}
              </span>
              <h3 className="font-serif text-2xl font-bold text-neutral-900 mt-0.5">
                {space.name}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {space.description}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-1">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>Climate</span>
                </div>
                <strong className="text-xs font-semibold text-neutral-800 block">{space.temp}</strong>
                <span className="text-[11px] text-neutral-500">{space.humidity}</span>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-1">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Aromatherapy</span>
                </div>
                <strong className="text-xs font-semibold text-neutral-800 block truncate">{space.aroma}</strong>
                <span className="text-[11px] text-neutral-500">Pure Essential Oils</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-neutral-800 block">Suite Features:</span>
              {space.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-neutral-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800 flex-shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <button
              onClick={() => openBookingFlow()}
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium px-4 py-2.5 rounded-lg transition cursor-pointer shadow-sm"
            >
              Book in this Suite
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-lg border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition cursor-pointer"
                aria-label="Previous space"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-lg border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition cursor-pointer"
                aria-label="Next space"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[280px] bg-neutral-100">
          <img
            src={space.imageUrl}
            alt={space.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </section>
  );
};
