import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Service, ServiceCategory, StaffProfile, User, MembershipPlan, Review } from '../../types';
import {
  Sparkles,
  Clock,
  Star,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Gift,
  HelpCircle,
  MapPin,
  Phone,
  Mail,
  Info,
  ArrowRight,
  ChevronRight,
  X,
  CreditCard,
  UserCheck
} from 'lucide-react';

import { HeroCarousel } from './HeroCarousel';
import { RitualsCarousel } from './RitualsCarousel';
import { SanctuarySpacesCarousel } from './SanctuarySpacesCarousel';
import { TreatmentJourneyCarousel } from './TreatmentJourneyCarousel';
import { PractitionersCarousel } from './PractitionersCarousel';
import { TestimonialsCarousel } from './TestimonialsCarousel';
import { PackagesCarousel } from './PackagesCarousel';
import { AmbianceSoundscape } from './AmbianceSoundscape';
import { RitualFinderModal } from './RitualFinderModal';

export const PublicSite: React.FC = () => {
  const {
    currentPublicTab,
    setCurrentPublicTab,
    openBookingFlow,
    setArea,
    setCurrentClientTab,
    showToast
  } = useApp();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<(StaffProfile & User)[]>([]);
  const [memberships, setMemberships] = useState<MembershipPlan[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<Service | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);

  // Gift card form
  const [giftAmount, setGiftAmount] = useState<number>(150);
  const [giftRecipient, setGiftRecipient] = useState<string>('');
  const [giftSender, setGiftSender] = useState<string>('');
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [giftPurchasedCode, setGiftPurchasedCode] = useState<string | null>(null);

  useEffect(() => {
    mockApi.getCategories().then(setCategories);
    mockApi.getServices().then(setServices);
    mockApi.getStaff().then(setStaff);
    mockApi.getMemberships().then(setMemberships);
    mockApi.getReviews().then(setReviews);
  }, []);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const filteredServices = activeCategoryFilter === 'all'
    ? services
    : services.filter((s) => s.category_id === activeCategoryFilter);

  const handleBuyGiftCard = () => {
    if (!giftRecipient || !giftSender) {
      showToast('Please enter recipient and sender names', 'warning');
      return;
    }
    const code = `SERENE-GIFT-${Math.floor(1000 + Math.random() * 9000)}-${giftAmount}`;
    setGiftPurchasedCode(code);
    showToast(`Gift voucher for $${giftAmount} issued successfully! Code: ${code}`, 'success');
  };

  return (
    <div id="public-site-container" className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans">
      {/* Public Navigation Header (Clean White & High Contrast) */}
      <header className="bg-white border-b border-neutral-200 sticky top-10 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div
            onClick={() => setCurrentPublicTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-neutral-900 block leading-tight">
                SERENE
              </span>
              <span className="text-[10px] tracking-widest text-neutral-500 uppercase font-semibold block">
                Spa & Wellness Clinic
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            {[
              { id: 'home', label: 'Home' },
              { id: 'services', label: 'Services & Pricing' },
              { id: 'team', label: 'Our Specialists' },
              { id: 'memberships', label: 'Memberships' },
              { id: 'giftcards', label: 'Gift Vouchers' },
              { id: 'about', label: 'About Us' },
              { id: 'faq', label: 'Policies & FAQ' },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`public-nav-${tab.id}`}
                onClick={() => setCurrentPublicTab(tab.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  currentPublicTab === tab.id
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="header-quiz-btn"
              onClick={() => setIsQuizOpen(true)}
              className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-700 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition cursor-pointer border border-neutral-200 font-medium"
            >
              <span>Treatment Finder</span>
            </button>

            <button
              id="public-client-portal-btn"
              onClick={() => {
                setArea('client');
                setCurrentClientTab('dashboard');
              }}
              className="text-xs text-neutral-700 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition cursor-pointer hidden sm:inline-block font-medium"
            >
              Client Login
            </button>

            <button
              id="public-book-now-header-btn"
              onClick={() => openBookingFlow()}
              className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Subnav */}
      <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-2 overflow-x-auto flex gap-2 text-xs">
        {['home', 'services', 'team', 'memberships', 'giftcards', 'about', 'faq'].map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentPublicTab(tab)}
            className={`px-3 py-1 rounded-md capitalize whitespace-nowrap font-medium ${
              currentPublicTab === tab ? 'bg-neutral-900 text-white' : 'text-neutral-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Areas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-12">
        {/* ===================== TAB: HOME ===================== */}
        {currentPublicTab === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* 1. Hero Luxury Presentation */}
            <HeroCarousel onOpenQuiz={() => setIsQuizOpen(true)} />

            {/* 2. Ambiance Audio Player Preview */}
            <AmbianceSoundscape />

            {/* 3. Featured Services */}
            <RitualsCarousel
              services={services}
              categories={categories}
              onSelectServiceDetail={(service) => setSelectedServiceDetail(service)}
            />

            {/* 4. Treatment Suites & Facilities */}
            <SanctuarySpacesCarousel />

            {/* 5. 4-Stage Guest Experience */}
            <TreatmentJourneyCarousel />

            {/* 6. Spa Packages */}
            <PackagesCarousel />

            {/* 7. Practitioners */}
            <PractitionersCarousel staff={staff} />

            {/* 8. Verified Guest Reviews */}
            <TestimonialsCarousel reviews={reviews} />

            {/* 9. Final Call to Action */}
            <section className="bg-white border border-neutral-200 rounded-2xl p-8 sm:p-12 text-center space-y-5 shadow-sm">
              <div className="max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Online Reservations
                </span>
                <h2 className="font-serif text-3xl font-bold text-neutral-900">
                  Ready to Experience Restorative Care?
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                  Select your treatment, choose your specialist, and book your appointment online in under 2 minutes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  id="footer-cta-reserve-btn"
                  onClick={() => openBookingFlow()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition shadow-sm cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book an Appointment</span>
                </button>

                <button
                  onClick={() => setIsQuizOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs sm:text-sm font-medium px-5 py-3.5 rounded-xl border border-neutral-300 transition cursor-pointer"
                >
                  <span>Find Your Ideal Treatment</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ===================== TAB: SERVICES ===================== */}
        {currentPublicTab === 'services' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5 max-w-2xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Menu & Pricing
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
                Treatment Services & Pricing
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600">
                Explore our full range of certified therapeutic bodywork, Japanese head spa rituals, and clinical facials.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap pb-2">
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeCategoryFilter === 'all'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                All Services ({services.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeCategoryFilter === cat.id
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  id={`public-service-card-${service.id}`}
                  className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-neutral-400 transition flex flex-col justify-between shadow-sm"
                >
                  <div className="relative h-48 overflow-hidden bg-neutral-100">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover"
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
                      <span>{service.duration_min} minutes</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-base font-bold text-neutral-900">
                        {service.name}
                      </h3>
                      <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed font-light">
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
                          onClick={() => setSelectedServiceDetail(service)}
                          className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => openBookingFlow(service)}
                          className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          <span>Book</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: TEAM ===================== */}
        {currentPublicTab === 'team' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5 max-w-2xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Our Team
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
                Licensed Practitioners & Therapists
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600">
                Every therapist at Serene is board-certified and brings years of dedicated clinical wellness expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {staff.map((member) => (
                <div
                  key={member.id}
                  id={`staff-card-${member.id}`}
                  className="p-6 rounded-2xl bg-white border border-neutral-200 flex flex-col sm:flex-row gap-5 items-start justify-between shadow-sm hover:border-neutral-400 transition"
                >
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-neutral-200 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-3 flex-1">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-lg font-bold text-neutral-900">{member.name}</h3>
                        <span className="text-xs text-neutral-700 font-semibold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {member.rating} ({member.reviewsCount})
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 font-medium">{member.title}</p>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed font-light">{member.bio}</p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {member.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => openBookingFlow(undefined, member.id)}
                        className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer shadow-sm"
                      >
                        Book with {member.name.split(' ')[0]}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: MEMBERSHIPS ===================== */}
        {currentPublicTab === 'memberships' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5 max-w-2xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Wellness Memberships
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
                Monthly Memberships & Credit Plans
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600">
                Enjoy preferred pricing, rollover credits, and priority scheduling with our flexible plans.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {memberships.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-7 rounded-2xl bg-white border flex flex-col justify-between space-y-6 shadow-sm ${
                    plan.popular
                      ? 'border-neutral-900 ring-1 ring-neutral-900 relative'
                      : 'border-neutral-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-neutral-900">{plan.name}</h3>
                      <p className="text-xs text-neutral-600 mt-1">{plan.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-3xl font-bold text-neutral-900">${plan.price}</span>
                      <span className="text-xs text-neutral-500">/ {plan.period}</span>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-neutral-100">
                      {plan.perks.map((perk, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                          <CheckCircle2 className="w-4 h-4 text-neutral-900 flex-shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showToast(`Enrolled in ${plan.name}! Credits added to your client wallet.`, 'success');
                      setArea('client');
                      setCurrentClientTab('dashboard');
                    }}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                      plan.popular
                        ? 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
                    }`}
                  >
                    Select {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: GIFT CARDS ===================== */}
        {currentPublicTab === 'giftcards' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5 max-w-xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Gift Vouchers
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
                Digital Gift Cards
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600">
                Gift relaxation and wellness to family, friends, or colleagues. Instant digital delivery with personalized notes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Form */}
              <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-sm">
                <h3 className="font-semibold text-neutral-900 text-sm">Configure Gift Voucher</h3>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Select Value ($)</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[100, 150, 200, 300].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setGiftAmount(amt)}
                        className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                          giftAmount === amt
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                    placeholder="Custom amount ($)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={giftRecipient}
                    onChange={(e) => setGiftRecipient(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Name (Sender)</label>
                  <input
                    type="text"
                    value={giftSender}
                    onChange={(e) => setGiftSender(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                    placeholder="e.g. Michael Jenkins"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Message</label>
                  <textarea
                    rows={2}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 resize-none focus:outline-none focus:border-neutral-900"
                    placeholder="Wishing you a wonderful, relaxing spa day!"
                  />
                </div>

                <button
                  onClick={handleBuyGiftCard}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
                >
                  Generate Digital Gift Voucher (${giftAmount})
                </button>
              </div>

              {/* Live Preview */}
              <div className="space-y-4">
                <div className="p-7 rounded-2xl bg-neutral-900 text-white space-y-6 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="font-serif font-bold text-sm tracking-wide">SERENE SPA VOUCHER</span>
                    </div>
                    <span className="font-serif text-2xl font-bold text-white">${giftAmount}</span>
                  </div>

                  <div className="space-y-1 py-4">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                      Presented To
                    </span>
                    <span className="font-serif text-xl font-bold text-white block">
                      {giftRecipient || 'Recipient Name'}
                    </span>
                    <p className="text-xs text-neutral-300 italic pt-2">
                      &quot;{giftMessage || 'Wishing you deep relaxation and wellness.'}&quot;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                    <span>From: {giftSender || 'Your Name'}</span>
                    <span className="font-mono text-white">
                      {giftPurchasedCode || 'SERENE-VOUCHER-PREVIEW'}
                    </span>
                  </div>
                </div>

                {giftPurchasedCode && (
                  <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-800 space-y-1">
                    <span className="font-bold block text-neutral-900">Voucher Issued Successfully</span>
                    <p>
                      Redemption Code: <strong className="font-mono">{giftPurchasedCode}</strong>. Enter this code at checkout to apply the voucher balance.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: ABOUT & FAQ ===================== */}
        {(currentPublicTab === 'about' || currentPublicTab === 'faq') && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5 max-w-2xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Clinic Policies
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
                Frequently Asked Questions & Policies
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  q: 'What is your cancellation and rescheduling policy?',
                  a: 'We offer complimentary cancellation and rescheduling up to 24 hours before your appointment start time. Inside the 24-hour window, a 50% late release fee is applied to protect our practitioners’ scheduled time.',
                },
                {
                  q: 'When should I arrive for my appointment?',
                  a: 'We ask all guests to arrive 15 minutes prior to their scheduled start time. This allows you to check in, change into plush robes and sandals, and complete any medical intake updates.',
                },
                {
                  q: 'What if I have allergies or health contraindications?',
                  a: 'Please indicate any allergies (tree nut oils, synthetic scents, iodine) during booking or on your client profile. Our therapists review all medical notes prior to each session and adjust botanical formulas accordingly.',
                },
                {
                  q: 'Are gratuities included in the service prices?',
                  a: 'Gratuities are entirely discretionary and not included in our base prices. You may choose to tip your therapist after the treatment via card or cash.',
                },
              ].map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-2 shadow-sm">
                  <h4 className="font-semibold text-neutral-900 text-sm flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-neutral-700 flex-shrink-0" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed pl-6 font-light">{faq.a}</p>
                </div>
              ))}
            </div>

            {/* Location & Contact */}
            <div className="p-7 rounded-2xl bg-white border border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-neutral-700 shadow-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neutral-800 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block font-semibold mb-0.5">San Francisco Clinic</strong>
                  <span>428 Botanical Way, Suite 300</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-neutral-800 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block font-semibold mb-0.5">Operating Hours</strong>
                  <span>Mon – Sun: 08:30 AM – 08:00 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-neutral-800 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block font-semibold mb-0.5">Concierge Support</strong>
                  <span>+1 (415) 890-2100 • contact@serenespa.com</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Service Detail Modal */}
      {selectedServiceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-neutral-200 text-neutral-900 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Treatment Profile
                </span>
                <h3 className="font-serif text-xl font-bold text-neutral-900 mt-0.5">
                  {selectedServiceDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedServiceDetail(null)}
                className="text-neutral-400 hover:text-neutral-900 p-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={selectedServiceDetail.imageUrl}
              alt={selectedServiceDetail.name}
              className="w-full h-48 object-cover rounded-xl border border-neutral-200"
              referrerPolicy="no-referrer"
            />

            <p className="text-xs text-neutral-600 leading-relaxed font-light">{selectedServiceDetail.description}</p>

            <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <div>
                <span className="text-neutral-500 block">Duration:</span>
                <span className="font-semibold text-neutral-900">{selectedServiceDetail.duration_min} minutes (+{selectedServiceDetail.buffer_min}m buffer)</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Price:</span>
                <span className="font-semibold text-neutral-900 text-sm">${selectedServiceDetail.price}</span>
              </div>
            </div>

            {selectedServiceDetail.beforeAfterCare && (
              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <strong className="text-neutral-900 block mb-0.5">Before Treatment Care:</strong>
                  <p className="text-neutral-600">{selectedServiceDetail.beforeAfterCare.before}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <strong className="text-neutral-900 block mb-0.5">After Treatment Guidance:</strong>
                  <p className="text-neutral-600">{selectedServiceDetail.beforeAfterCare.after}</p>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                onClick={() => setSelectedServiceDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const s = selectedServiceDetail;
                  setSelectedServiceDetail(null);
                  openBookingFlow(s);
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <span>Book This Treatment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Treatment Finder Modal */}
      <RitualFinderModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        services={services}
      />

      {/* Public Footer */}
      <footer className="bg-white border-t border-neutral-200 py-10 px-4 text-xs text-neutral-500 text-center space-y-2 mt-auto">
        <div className="flex items-center justify-center gap-2 text-neutral-900 font-serif text-sm font-semibold">
          <Sparkles className="w-4 h-4 text-neutral-800" />
          <span>SERENE SPA & WELLNESS CLINIC</span>
        </div>
        <p className="max-w-md mx-auto text-neutral-500 leading-relaxed">
          428 Botanical Way, Suite 300, San Francisco, CA • Open 7 Days a Week 8:30 AM – 8:00 PM
        </p>
        <p className="text-neutral-400 text-[11px]">© 2026 Serene Wellness. All rights reserved.</p>
      </footer>
    </div>
  );
};
