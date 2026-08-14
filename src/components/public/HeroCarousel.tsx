import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeroSlide {
  id: string;
  tag: string;
  headline: string;
  headlineHighlight: string;
  description: string;
  imageUrl: string;
  badgeText: string;
  ratingText: string;
  priceNote: string;
  serviceCategory: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-scalp',
    tag: 'Japanese Head Spa & Scalp Care',
    headline: 'Restorative Scalp Therapy &',
    headlineHighlight: 'Cascading Water Treatment',
    description: 'Targeted herbal scalp exfoliation, warm hydrotherapy waterfall massage, and pressure point relief designed to reduce tension and stimulate healthy hair growth.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85',
    badgeText: 'Most Popular',
    ratingText: '4.99 (280+ reviews)',
    priceNote: '$175 • 60 min',
    serviceCategory: 'cat-hydro',
  },
  {
    id: 'slide-stone',
    tag: 'Deep Tissue & Thermal Massage',
    headline: 'Relieve Muscle Tension with',
    headlineHighlight: 'Warm Himalayan Salt Stones',
    description: 'Therapeutic heated salt stones combined with targeted deep tissue techniques to release chronic tension knots, improve circulation, and soothe sore muscles.',
    imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1600&q=85',
    badgeText: 'Therapeutic Recovery',
    ratingText: '4.98 (190+ reviews)',
    priceNote: '$195 • 75 min',
    serviceCategory: 'cat-massage',
  },
  {
    id: 'slide-facial',
    tag: 'Clinical Facial Therapy',
    headline: 'Restore Skin Hydration & Tone with',
    headlineHighlight: 'Lymphatic Gua Sha & Peptides',
    description: 'Custom botanical infusions paired with gentle lymphatic drainage and rose quartz sculpting to contour facial contours and restore skin elasticity.',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=85',
    badgeText: 'Organic & Clean',
    ratingText: '4.97 (165+ reviews)',
    priceNote: '$185 • 60 min',
    serviceCategory: 'cat-facial',
  },
  {
    id: 'slide-couples',
    tag: 'Couples & Duo Suites',
    headline: 'Side-by-Side Massages in Our',
    headlineHighlight: 'Private Hydrotherapy Suite',
    description: 'Spacious private treatment suite with twin soaking cedar baths, customized therapeutic massages, and private lounge amenities.',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=85',
    badgeText: 'Private Suite',
    ratingText: '5.0 (95+ reviews)',
    priceNote: '$380 • 120 min',
    serviceCategory: 'cat-body',
  },
];

interface HeroCarouselProps {
  onOpenQuiz: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onOpenQuiz }) => {
  const { openBookingFlow, setCurrentPublicTab } = useApp();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentIdx];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section
      id="hero-carousel-section"
      className="relative bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Left Column: Content (Crisp Black on White) */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
                {slide.tag}
              </span>
              <span className="text-xs text-neutral-600 font-medium flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{slide.ratingText}</span>
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
                {slide.headline}{' '}
                <span className="text-neutral-950 underline decoration-neutral-300 underline-offset-4 font-extrabold block sm:inline">
                  {slide.headlineHighlight}
                </span>
              </h1>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
              {slide.description}
            </p>

            <div className="flex items-center gap-4 text-xs font-semibold text-neutral-800 pt-1">
              <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
                <Clock className="w-4 h-4 text-neutral-600" />
                <span>{slide.priceNote}</span>
              </div>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-600">Certified Licensed Practitioners</span>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="hero-book-now-btn"
                onClick={() => openBookingFlow()}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm px-6 py-3.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-view-services-btn"
                onClick={() => setCurrentPublicTab('services')}
                className="bg-white hover:bg-neutral-100 text-neutral-800 font-medium text-sm px-5 py-3.5 rounded-xl border border-neutral-300 transition cursor-pointer"
              >
                View Treatment Menu
              </button>
            </div>

            {/* Carousel navigation indicators */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIdx === idx ? 'w-8 bg-neutral-900' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-lg border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-8 h-8 rounded-lg border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High Quality Photography */}
        <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full bg-neutral-100">
          <img
            src={slide.imageUrl}
            alt={slide.headline}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-neutral-200 shadow-sm text-xs font-semibold text-neutral-900">
            {slide.badgeText}
          </div>
        </div>
      </div>
    </section>
  );
};
