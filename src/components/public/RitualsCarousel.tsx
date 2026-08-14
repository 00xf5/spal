import React, { useState, useEffect } from 'react';
import { Service, ServiceCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { Clock, ArrowRight, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface RitualsCarouselProps {
  services: Service[];
  categories: ServiceCategory[];
  onSelectServiceDetail: (service: Service) => void;
}

export const RitualsCarousel: React.FC<RitualsCarouselProps> = ({
  services,
  categories,
  onSelectServiceDetail,
}) => {
  const { openBookingFlow, setCurrentPublicTab } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter((s) => s.category_id === activeCategory);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const maxIndex = Math.max(0, filteredServices.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleServices = filteredServices.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section id="featured-treatments-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Treatment Menu
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
            Featured Spa & Wellness Services
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPublicTab('services')}
            className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 underline underline-offset-4 cursor-pointer mr-2"
          >
            View Full Menu ({services.length})
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-8 h-8 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-neutral-700 transition cursor-pointer"
              aria-label="Previous services"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="w-8 h-8 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-neutral-700 transition cursor-pointer"
              aria-label="Next services"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-neutral-900 text-white'
              : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          All Services ({services.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-neutral-900 text-white'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleServices.map((service) => (
          <div
            key={service.id}
            className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-neutral-400 transition flex flex-col justify-between shadow-sm"
          >
            <div className="relative h-48 overflow-hidden bg-neutral-100">
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-neutral-900 border border-neutral-200 shadow-sm">
                ${service.price}
              </div>
              {service.popular && (
                <div className="absolute top-3 left-3 bg-neutral-900 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                  Popular
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-medium text-neutral-700 flex items-center gap-1 border border-neutral-200">
                <Clock className="w-3 h-3 text-neutral-500" />
                <span>{service.duration_min} min</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  {service.name}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {service.contraindications && service.contraindications.length > 0 && (
                  <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                    <span className="truncate">Safety: {service.contraindications[0]}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectServiceDetail(service)}
                    className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition cursor-pointer"
                  >
                    Details & Care
                  </button>
                  <button
                    onClick={() => openBookingFlow(service)}
                    className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
