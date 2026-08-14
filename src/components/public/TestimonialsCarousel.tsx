import React from 'react';
import { Review } from '../../types';
import { Star, CheckCircle } from 'lucide-react';

interface TestimonialsCarouselProps {
  reviews: Review[];
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({ reviews }) => {
  return (
    <section id="guest-reviews-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Guest Feedback
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
            Verified Client Reviews
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
            ))}
          </div>
          <span>4.98 / 5.0 Average Rating (520+ Reviews)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((rev) => (
          <div
            key={rev.id}
            className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
                <span className="text-[11px] text-neutral-400">{rev.date}</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-light italic">
                &quot;{rev.comment}&quot;
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <strong className="text-xs font-semibold text-neutral-900 block">{rev.client_name}</strong>
                <span className="text-[11px] text-neutral-500">{rev.service_name}</span>
              </div>
              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-medium flex items-center gap-1 border border-neutral-200">
                <CheckCircle className="w-3 h-3 text-neutral-700" />
                <span>Verified</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
