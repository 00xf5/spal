import React from 'react';
import { StaffProfile, User } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, ArrowRight, ShieldCheck } from 'lucide-react';

interface PractitionersCarouselProps {
  staff: (StaffProfile & User)[];
}

export const PractitionersCarousel: React.FC<PractitionersCarouselProps> = ({ staff }) => {
  const { openBookingFlow, setCurrentPublicTab } = useApp();

  return (
    <section id="our-practitioners-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Our Specialists
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
            Certified Therapists & Specialists
          </h2>
        </div>

        <button
          onClick={() => setCurrentPublicTab('team')}
          className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 underline underline-offset-4 cursor-pointer"
        >
          View Full Team ({staff.length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-neutral-200 rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-neutral-400 transition"
          >
            <div className="space-y-3">
              <div className="relative h-44 rounded-xl overflow-hidden bg-neutral-100">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-semibold text-neutral-800 flex items-center gap-1 border border-neutral-200 shadow-sm">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{member.rating}</span>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  {member.name}
                </h3>
                <span className="text-xs font-medium text-neutral-600 block">{member.title}</span>
              </div>

              <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-light">
                {member.bio}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {member.specialties.slice(0, 2).map((spec, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => openBookingFlow(undefined, member.id)}
              className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs font-medium rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Book with {member.name.split(' ')[0]}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
