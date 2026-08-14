import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Service, StaffProfile, User, ServiceCategory, ServiceAddon, AvailabilitySlot, Booking } from '../../types';
import {
  X,
  User as UserIcon,
  Calendar,
  Clock,
  Check,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  CheckCircle,
  Plus,
  Info,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialService?: Service | null;
  initialStaffId?: string | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  initialService: propInitialService,
  initialStaffId: propInitialStaffId,
}) => {
  const {
    bookingFlowOpen,
    closeBookingFlow,
    preselectedService,
    preselectedStaffId,
    showToast,
    triggerDataRefresh,
    setArea,
    setCurrentClientTab,
    currentClientUser
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : bookingFlowOpen;
  const onClose = propOnClose || closeBookingFlow;
  const initialService = propInitialService !== undefined ? propInitialService : preselectedService;
  const initialStaffId = propInitialStaffId !== undefined ? propInitialStaffId : preselectedStaffId;

  // Wizard Step (1: Service, 2: Therapist, 3: Date & Time, 4: Enhancements, 5: Client Info, 6: Payment, 7: Confirmed)
  const [step, setStep] = useState<number>(1);

  // Data collections
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<(StaffProfile & User)[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Selections
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<ServiceAddon[]>([]);

  // Client Details
  const [clientName, setClientName] = useState<string>(currentClientUser?.name || 'Sarah Jenkins');
  const [clientEmail, setClientEmail] = useState<string>(currentClientUser?.email || 'sarah.jenkins@example.com');
  const [clientPhone, setClientPhone] = useState<string>(currentClientUser?.phone || '+1 (415) 890-2100');
  const [clientAllergies, setClientAllergies] = useState<string>(currentClientUser?.profile?.allergies?.join(', ') || '');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [agreedToPolicy, setAgreedToPolicy] = useState<boolean>(true);

  // Promo code
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState<string | null>(null);

  // Payment info
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('888');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Available Enhancements
  const availableAddons: ServiceAddon[] = [
    { id: 'add-oil', name: 'Warm Organic Cedar & Lavender Oil', price: 25, duration_min: 0, description: 'Botanical essential oils for deep tension release' },
    { id: 'add-stone', name: 'Heated Himalayan Salt Stones Accent', price: 35, duration_min: 15, description: 'Targeted warm mineral stone placement on back and shoulders' },
    { id: 'add-scalp', name: 'Peppermint Scalp Acupressure', price: 30, duration_min: 15, description: 'Stimulating cranial pressure point therapy' },
    { id: 'add-scrub', name: 'Eucalyptus Foot Polish & Reflexology', price: 28, duration_min: 15, description: 'Warm towel wrap and botanical foot scrub' },
  ];

  // Initialize data
  useEffect(() => {
    if (isOpen) {
      mockApi.getCategories().then(setCategories);
      mockApi.getServices().then((srvs) => {
        setServices(srvs);
        if (initialService) {
          setSelectedService(initialService);
          setStep(2);
        } else if (!selectedService && srvs.length > 0) {
          setSelectedService(srvs[0]);
        }
      });
      mockApi.getStaff().then(setStaffList);
      if (initialStaffId) {
        setSelectedStaffId(initialStaffId);
      }
    }
  }, [isOpen, initialService, initialStaffId]);

  // Load available time slots
  useEffect(() => {
    if (isOpen && selectedService && selectedDate) {
      const staffFilter = selectedStaffId === 'any' ? undefined : selectedStaffId;
      mockApi
        .searchAvailability({
          date: selectedDate,
          serviceId: selectedService.id,
          staffId: staffFilter,
        })
        .then((slots) => {
          const openSlots = slots.filter((s) => s.available);
          setAvailableSlots(openSlots);
          if (openSlots.length > 0) {
            setSelectedTimeSlot(openSlots[0].time);
          } else {
            setSelectedTimeSlot('');
          }
        });
    }
  }, [isOpen, selectedService, selectedStaffId, selectedDate]);

  if (!isOpen) return null;

  const handleApplyPromo = () => {
    if (promoCodeInput.trim().toUpperCase() === 'SERENE10') {
      setPromoDiscount(10);
      setPromoApplied('SERENE10 (10% Off)');
      showToast('Promo code SERENE10 applied! 10% discount added.', 'success');
    } else if (promoCodeInput.trim().toUpperCase() === 'WELCOME20') {
      setPromoDiscount(20);
      setPromoApplied('WELCOME20 (20% Off)');
      showToast('Promo code WELCOME20 applied! 20% discount added.', 'success');
    } else {
      showToast('Invalid promo code. Try SERENE10 or WELCOME20', 'error');
    }
  };

  const handleToggleAddon = (addon: ServiceAddon) => {
    if (selectedAddons.find((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Price calculations
  const basePrice = selectedService?.price || 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const subtotal = basePrice + addonsTotal;
  const discountAmount = (subtotal * promoDiscount) / 100;
  const tax = (subtotal - discountAmount) * 0.085;
  const finalTotal = Math.max(0, subtotal - discountAmount + tax);

  const handleFinalCheckout = async () => {
    if (!selectedService || !selectedTimeSlot) {
      showToast('Please select a service and time slot', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      const staffObj = staffList.find((s) => s.id === selectedStaffId) || staffList[0];

      const booking = await mockApi.createBooking({
        serviceId: selectedService.id,
        staffId: selectedStaffId === 'any' ? (staffObj?.id || 'staff-1') : selectedStaffId,
        locationId: 'loc-1',
        date: selectedDate,
        startTime: selectedTimeSlot,
        addons: selectedAddons,
        client: {
          id: currentClientUser?.id || 'client-1',
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          notes: clientNotes,
          allergies: clientAllergies.split(',').map((s) => s.trim()).filter(Boolean),
        },
        payment: {
          method: 'card',
          cardLast4: '4242',
        },
      });

      setConfirmedBooking(booking);
      setStep(7);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      triggerDataRefresh();
      showToast('Appointment confirmed and booked successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Booking failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter((s) => s.category_id === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-neutral-200 text-neutral-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 sm:px-8 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
              Online Reservations
            </span>
            <h2 className="font-serif text-xl font-bold text-neutral-900">
              Book Your Spa & Wellness Appointment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Pills */}
        {step < 7 && (
          <div className="px-5 sm:px-8 py-3 bg-neutral-50 border-b border-neutral-200 overflow-x-auto flex items-center gap-2 text-xs">
            {[
              { num: 1, label: '1. Service' },
              { num: 2, label: '2. Specialist' },
              { num: 3, label: '3. Date & Time' },
              { num: 4, label: '4. Add-ons' },
              { num: 5, label: '5. Client Details' },
              { num: 6, label: '6. Payment' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => s.num < step && setStep(s.num)}
                disabled={s.num > step}
                className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap transition cursor-pointer ${
                  step === s.num
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : step > s.num
                    ? 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
                    : 'text-neutral-400 cursor-not-allowed'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {/* STEP 1: SERVICE SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                      selectedCategory === c.id
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredServices.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                      selectedService?.id === srv.id
                        ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                        : 'border-neutral-200 bg-white hover:border-neutral-400'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif text-base font-bold text-neutral-900">{srv.name}</h4>
                        <span className="font-serif font-bold text-neutral-900 text-base">${srv.price}</span>
                      </div>
                      <p className="text-xs text-neutral-600 line-clamp-2">{srv.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-500 pt-1 border-t border-neutral-100">
                      <span>{srv.duration_min} minutes</span>
                      {selectedService?.id === srv.id && (
                        <span className="font-semibold text-neutral-900 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Selected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SPECIALIST */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-xs text-neutral-500">
                Choose a preferred certified specialist or select &apos;First Available&apos; for fastest scheduling.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Any Provider */}
                <div
                  onClick={() => setSelectedStaffId('any')}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3.5 ${
                    selectedStaffId === 'any'
                      ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                      : 'border-neutral-200 bg-white hover:border-neutral-400'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                    ANY
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-900">First Available Specialist</h4>
                    <p className="text-xs text-neutral-500">Fastest confirmation with any qualified therapist</p>
                  </div>
                </div>

                {staffList.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setSelectedStaffId(member.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3.5 ${
                      selectedStaffId === member.id
                        ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                        : 'border-neutral-200 bg-white hover:border-neutral-400'
                    }`}
                  >
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm text-neutral-900">{member.name}</h4>
                        <span className="text-xs text-amber-600 font-bold">★ {member.rating}</span>
                      </div>
                      <p className="text-xs text-neutral-500">{member.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: DATE & TIME */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                    Select Appointment Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 font-medium focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                    Available Openings ({availableSlots.length})
                  </label>
                  {availableSlots.length === 0 ? (
                    <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-500 text-xs">
                      No openings available on this date. Please pick another day.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`py-2.5 rounded-xl text-xs font-semibold border text-center transition cursor-pointer ${
                            selectedTimeSlot === slot.time
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ENHANCEMENTS */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-xs text-neutral-500">
                Customize your session with optional therapeutic add-on enhancements.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableAddons.map((addon) => {
                  const isChecked = Boolean(selectedAddons.find((a) => a.id === addon.id));
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                        isChecked
                          ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                          : 'border-neutral-200 bg-white hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-xs text-neutral-900">{addon.name}</h4>
                          <p className="text-[11px] text-neutral-500 mt-0.5">{addon.description}</p>
                        </div>
                        <span className="font-serif font-bold text-neutral-900 text-xs">+${addon.price}</span>
                      </div>
                      <div className="flex justify-end">
                        <span className={`text-[11px] font-semibold ${isChecked ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          {isChecked ? '✓ Added' : '+ Add'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: CLIENT DETAILS */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Known Allergies / Sensitivities</label>
                  <input
                    type="text"
                    value={clientAllergies}
                    onChange={(e) => setClientAllergies(e.target.value)}
                    placeholder="e.g. Nut oils, lavender, etc."
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Special Requests / Focus Areas</label>
                <textarea
                  rows={2}
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="e.g. Focus on neck and shoulder knots, prefer light pressure, etc."
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 resize-none focus:outline-none focus:border-neutral-900"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreedToPolicy}
                  onChange={(e) => setAgreedToPolicy(e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                />
                <span>I understand and agree to the 24-hour clinic cancellation and health intake policy.</span>
              </label>
            </div>
          )}

          {/* STEP 6: PAYMENT & REVIEW */}
          {step === 6 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-7 space-y-4">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <h4 className="font-semibold text-xs text-neutral-900 uppercase tracking-wider">Payment Information</h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Expiration</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Security CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <span className="text-[11px] font-semibold text-neutral-700 block uppercase tracking-wider">Promo Code or Voucher</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder="e.g. SERENE10"
                      className="flex-1 bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs uppercase font-mono text-neutral-900 focus:outline-none"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && <span className="text-[11px] text-emerald-700 font-semibold block">{promoApplied}</span>}
                </div>
              </div>

              {/* Summary Bill */}
              <div className="md:col-span-5 p-5 rounded-2xl bg-neutral-900 text-white space-y-4 shadow-md">
                <h4 className="font-serif font-bold text-base">Booking Summary</h4>
                <div className="space-y-1 text-xs text-neutral-300">
                  <div className="font-semibold text-white">{selectedService?.name}</div>
                  <div>Date: {selectedDate} ({selectedTimeSlot})</div>
                  <div>Therapist: {staffList.find((s) => s.id === selectedStaffId)?.name || 'First Available'}</div>
                </div>

                <div className="space-y-2 pt-3 border-t border-neutral-800 text-xs">
                  <div className="flex justify-between text-neutral-300">
                    <span>Base Treatment:</span>
                    <span>${basePrice}</span>
                  </div>
                  {addonsTotal > 0 && (
                    <div className="flex justify-between text-neutral-300">
                      <span>Add-ons ({selectedAddons.length}):</span>
                      <span>+${addonsTotal}</span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({promoDiscount}%):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-300">
                    <span>Taxes & Fees (8.5%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-700">
                    <span>Total Amount:</span>
                    <span className="font-serif text-lg">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: CONFIRMATION RECEIPT */}
          {step === 7 && confirmedBooking && (
            <div className="text-center py-6 space-y-6 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto">
                <Check className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Reference ID: {confirmedBooking.id}
                </span>
                <h3 className="font-serif text-2xl font-bold text-neutral-900">
                  Your Visit is Confirmed!
                </h3>
                <p className="text-xs text-neutral-600">
                  A confirmation email and calendar invitation have been sent to <strong>{confirmedBooking.client_email}</strong>.
                </p>
              </div>

              <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Treatment:</span>
                  <span className="font-semibold text-neutral-900">{confirmedBooking.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Therapist:</span>
                  <span className="font-semibold text-neutral-900">{confirmedBooking.staff_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Date & Time:</span>
                  <span className="font-semibold text-neutral-900">{confirmedBooking.date} at {confirmedBooking.startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Total Paid:</span>
                  <span className="font-semibold text-neutral-900">${confirmedBooking.price_paid}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    setArea('client');
                    setCurrentClientTab('bookings');
                  }}
                  className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition cursor-pointer shadow-sm"
                >
                  View in Client Portal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step < 7 && (
          <div className="p-4 sm:px-8 border-t border-neutral-200 flex items-center justify-between bg-neutral-50">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-100 transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 6 ? (
              <button
                onClick={() => {
                  if (step === 1 && !selectedService) {
                    showToast('Please select a service', 'warning');
                    return;
                  }
                  if (step === 3 && !selectedTimeSlot) {
                    showToast('Please select a time slot', 'warning');
                    return;
                  }
                  if (step === 5 && (!clientName || !clientEmail)) {
                    showToast('Please enter your name and email', 'warning');
                    return;
                  }
                  setStep(step + 1);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinalCheckout}
                disabled={isSubmitting || !agreedToPolicy}
                className="px-6 py-2.5 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <span>{isSubmitting ? 'Processing...' : `Confirm & Pay $${finalTotal.toFixed(2)}`}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
