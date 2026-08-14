import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Booking, AvailabilitySlot, GiftCard } from '../../types';
import {
  Calendar,
  Clock,
  User,
  Sparkles,
  RefreshCw,
  XCircle,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ChevronRight,
  PlusCircle,
  FileText,
  AlertTriangle,
  Award,
  Phone,
  Mail,
  Save,
  Tag,
  Download,
  Gift,
  Check,
  X
} from 'lucide-react';

export const ClientApp: React.FC = () => {
  const {
    currentClientTab,
    setCurrentClientTab,
    currentClientUser,
    activeClientId,
    openBookingFlow,
    showToast,
    triggerDataRefresh,
    dataVersion,
  } = useApp();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterTab, setFilterTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<Booking | null>(null);

  // Reschedule Modal state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState<boolean>(false);
  const [bookingToReschedule, setBookingToReschedule] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [rescheduleSlots, setRescheduleSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState<string>('');
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);

  // Cancel Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Schedule conflict');
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // Profile Edit state
  const [profileName, setProfileName] = useState<string>(currentClientUser?.name || '');
  const [profilePhone, setProfilePhone] = useState<string>(currentClientUser?.phone || '');
  const [profileAllergies, setProfileAllergies] = useState<string>(
    currentClientUser?.profile?.allergies?.join(', ') || ''
  );
  const [profileMedicalNotes, setProfileMedicalNotes] = useState<string>(
    currentClientUser?.profile?.medicalNotes || ''
  );
  const [profileEmergencyName, setProfileEmergencyName] = useState<string>(
    currentClientUser?.profile?.emergency_contact?.name || ''
  );
  const [profileEmergencyPhone, setProfileEmergencyPhone] = useState<string>(
    currentClientUser?.profile?.emergency_contact?.phone || ''
  );

  // Treatment Preferences State
  const [prefPressure, setPrefPressure] = useState<string>('Firm Deep Tissue');
  const [prefScent, setPrefScent] = useState<string>('Lavender & Cedarwood');
  const [prefLighting, setPrefLighting] = useState<string>('Dim Amber');
  const [prefTemp, setPrefTemp] = useState<string>('Warm (74°F / 23°C)');
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  // Gift card / Credits state
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [newGiftCode, setNewGiftCode] = useState<string>('');

  useEffect(() => {
    if (currentClientUser) {
      setProfileName(currentClientUser.name);
      setProfilePhone(currentClientUser.phone);
      setProfileAllergies(currentClientUser.profile.allergies.join(', '));
      setProfileMedicalNotes(currentClientUser.profile.medicalNotes || '');
      setProfileEmergencyName(currentClientUser.profile.emergency_contact?.name || '');
      setProfileEmergencyPhone(currentClientUser.profile.emergency_contact?.phone || '');
    }
  }, [currentClientUser]);

  // Load client bookings
  useEffect(() => {
    mockApi.getBookings({ clientId: activeClientId }).then((res) => {
      setBookings(res);
    });
    mockApi.getGiftCards().then(setGiftCards);
  }, [activeClientId, dataVersion]);

  // Fetch slots for reschedule date
  useEffect(() => {
    if (rescheduleModalOpen && bookingToReschedule) {
      mockApi
        .searchAvailability({
          date: rescheduleDate,
          serviceId: bookingToReschedule.service_id,
          staffId: bookingToReschedule.staff_id,
        })
        .then((slots) => {
          const openSlots = slots.filter((s) => s.available);
          setRescheduleSlots(openSlots);
          if (openSlots.length > 0) {
            setSelectedRescheduleSlot(openSlots[0].time);
          } else {
            setSelectedRescheduleSlot('');
          }
        });
    }
  }, [rescheduleModalOpen, rescheduleDate, bookingToReschedule]);

  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = bookings.filter((b) => b.status === 'completed');
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  const handleOpenReschedule = (booking: Booking) => {
    setBookingToReschedule(booking);
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = async () => {
    if (!bookingToReschedule || !selectedRescheduleSlot) {
      showToast('Please select an available time slot', 'warning');
      return;
    }
    setIsRescheduling(true);
    try {
      await mockApi.rescheduleBooking(
        bookingToReschedule.id,
        rescheduleDate,
        selectedRescheduleSlot
      );
      showToast('Appointment rescheduled successfully', 'success');
      setRescheduleModalOpen(false);
      setBookingToReschedule(null);
      triggerDataRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to reschedule appointment', 'error');
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleOpenCancel = (booking: Booking) => {
    setBookingToCancel(booking);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);
    try {
      await mockApi.cancelBooking(bookingToCancel.id, cancelReason);
      showToast('Appointment cancelled. Refund processed per policy.', 'info');
      setCancelModalOpen(false);
      setBookingToCancel(null);
      triggerDataRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClientUser) return;
    setIsSavingProfile(true);
    try {
      const allergiesArr = profileAllergies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await mockApi.updateClientProfile(
        currentClientUser.id,
        {
          allergies: allergiesArr,
          medicalNotes: profileMedicalNotes,
          emergency_contact: {
            name: profileEmergencyName,
            phone: profileEmergencyPhone,
            relationship: 'Emergency Contact',
          },
        },
        {
          name: profileName,
          phone: profilePhone,
        }
      );
      showToast('Medical intake and profile updated successfully', 'success');
      triggerDataRefresh();
    } catch (err: any) {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleRedeemGiftCard = () => {
    if (!newGiftCode.trim()) {
      showToast('Please enter a voucher code', 'warning');
      return;
    }
    showToast(`Voucher ${newGiftCode.toUpperCase()} applied! $50 credit added.`, 'success');
    setNewGiftCode('');
  };

  return (
    <div id="client-portal-container" className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* Top Client Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
              {currentClientUser?.name.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl font-bold text-neutral-900">
                  {currentClientUser?.name || 'Sarah Jenkins'}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-200 px-2 py-0.5 rounded">
                  {currentClientUser?.profile.memberTier || 'Gold'} Member
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-light">
                Member ID: {currentClientUser?.id} • {currentClientUser?.email}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2">
            <nav className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
                { id: 'bookings', label: 'Appointments', count: upcomingBookings.length, icon: Calendar },
                { id: 'profile', label: 'Health Profile', icon: FileText },
                { id: 'wallet', label: 'Wallet & Credits', icon: CreditCard },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = currentClientTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`client-tab-${tab.id}`}
                    onClick={() => setCurrentClientTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="bg-neutral-900 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <button
              id="client-book-new-btn"
              onClick={() => openBookingFlow()}
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book New</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* ===================== TAB: DASHBOARD ===================== */}
        {currentClientTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Next Upcoming Appointment Banner */}
            {upcomingBookings.length > 0 ? (
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white px-2 py-0.5 rounded">
                      Next Confirmed Visit
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      Ref: {upcomingBookings[0].id}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-600 font-medium">
                    24h Cancellation Policy Applies
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8 space-y-3">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-neutral-900">
                        {upcomingBookings[0].service_name}
                      </h2>
                      <p className="text-xs text-neutral-600 font-medium mt-0.5">
                        Therapist: <strong className="text-neutral-900">{upcomingBookings[0].staff_name}</strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-neutral-700">
                      <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
                        <Calendar className="w-4 h-4 text-neutral-600" />
                        <span className="font-semibold">{upcomingBookings[0].date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
                        <Clock className="w-4 h-4 text-neutral-600" />
                        <span className="font-semibold">
                          {upcomingBookings[0].start_time} - {upcomingBookings[0].end_time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
                        <CreditCard className="w-4 h-4 text-neutral-600" />
                        <span>${upcomingBookings[0].price} Paid</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2 justify-end">
                    <button
                      onClick={() => handleOpenReschedule(upcomingBookings[0])}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reschedule Date / Time</span>
                    </button>
                    <button
                      onClick={() => handleOpenCancel(upcomingBookings[0])}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel Appointment</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center space-y-3 shadow-sm">
                <Calendar className="w-8 h-8 text-neutral-400 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-neutral-900">No Upcoming Appointments</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  You have no scheduled visits. Browse our treatment menu to reserve your next restorative session.
                </p>
                <button
                  onClick={() => openBookingFlow()}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer shadow-sm inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Book an Appointment</span>
                </button>
              </div>
            )}

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                  Available Spa Credits
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-neutral-900">
                    ${currentClientUser?.profile.creditsRemaining || 120}
                  </span>
                  <span className="text-xs text-neutral-500">Rollover auto-active</span>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                  Membership Tier
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-2xl font-bold text-neutral-900">
                    {currentClientUser?.profile.memberTier || 'Gold Tier'}
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                  Past Completed Visits
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl font-bold text-neutral-900">
                    {pastBookings.length}
                  </span>
                  <button
                    onClick={() => {
                      setCurrentClientTab('bookings');
                      setFilterTab('past');
                    }}
                    className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 underline"
                  >
                    View History
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: BOOKINGS ===================== */}
        {currentClientTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                {(['upcoming', 'past', 'cancelled'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                      filterTab === tab
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {tab} (
                    {tab === 'upcoming'
                      ? upcomingBookings.length
                      : tab === 'past'
                      ? pastBookings.length
                      : cancelledBookings.length}
                    )
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {filterTab === 'upcoming' && (
              <div className="space-y-4">
                {upcomingBookings.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-neutral-200 rounded-2xl text-neutral-500 text-xs">
                    No upcoming appointments.
                  </div>
                ) : (
                  upcomingBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 bg-white border border-neutral-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-base font-bold text-neutral-900">
                            {b.service_name}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200">
                            Confirmed
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 font-medium">
                          Therapist: <strong className="text-neutral-900">{b.staff_name}</strong>
                        </p>
                        <div className="flex items-center gap-3 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {b.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {b.start_time} - {b.end_time}
                          </span>
                          <span>• ${b.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBookingForDetail(b)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleOpenReschedule(b)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-900 cursor-pointer"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleOpenCancel(b)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {filterTab === 'past' && (
              <div className="space-y-4">
                {pastBookings.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-neutral-200 rounded-2xl text-neutral-500 text-xs">
                    No past visits recorded.
                  </div>
                ) : (
                  pastBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 bg-white border border-neutral-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1">
                        <h4 className="font-serif text-base font-bold text-neutral-900">
                          {b.service_name}
                        </h4>
                        <p className="text-xs text-neutral-600 font-medium">
                          Therapist: {b.staff_name} • Date: {b.date} ({b.start_time})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBookingForDetail(b)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                        >
                          Receipt & SOAP Notes
                        </button>
                        <button
                          onClick={() => openBookingFlow(undefined, b.staff_id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer shadow-sm"
                        >
                          Book Again
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {filterTab === 'cancelled' && (
              <div className="space-y-4">
                {cancelledBookings.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-neutral-200 rounded-2xl text-neutral-500 text-xs">
                    No cancelled appointments.
                  </div>
                ) : (
                  cancelledBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 bg-white border border-neutral-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-75 shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-base font-bold text-neutral-900 line-through">
                            {b.service_name}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200">
                            Cancelled
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">
                          Scheduled for {b.date} at {b.start_time} • Refund status: Complete
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: PROFILE ===================== */}
        {currentClientTab === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
            <form onSubmit={handleSaveProfile} className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  Medical Intake & Health Profile
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Your certified therapists review these health notes prior to each session to ensure safe botanical formulations and customized pressure.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Health Contraindications & Allergies
                </h4>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    Known Allergies (e.g. Nut oils, Lavender, Latex, Iodine)
                  </label>
                  <input
                    type="text"
                    value={profileAllergies}
                    onChange={(e) => setProfileAllergies(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                    placeholder="None or list items separated by comma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    Medical Notes, Recent Surgeries, or Pregnancy
                  </label>
                  <textarea
                    rows={3}
                    value={profileMedicalNotes}
                    onChange={(e) => setProfileMedicalNotes(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 resize-none focus:outline-none focus:border-neutral-900"
                    placeholder="Provide details on spine injuries, high blood pressure, pregnancy trimester, etc."
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={profileEmergencyName}
                      onChange={(e) => setProfileEmergencyName(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={profileEmergencyPhone}
                      onChange={(e) => setProfileEmergencyPhone(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingProfile ? 'Saving...' : 'Save Health Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================== TAB: WALLET & CREDITS ===================== */}
        {currentClientTab === 'wallet' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Balances */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-5 shadow-sm">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                    Account Balance
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-3xl font-bold text-neutral-900">
                      ${currentClientUser?.profile.creditsRemaining || 120}
                    </span>
                    <span className="text-xs text-neutral-500">Available Credits</span>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-neutral-100 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Membership Monthly Allotment:</span>
                    <span className="font-semibold text-neutral-900">$100 / mo</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Unused Credits Expiration:</span>
                    <span className="font-semibold text-neutral-900">Never (Rollover Active)</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Retail Product Discount:</span>
                    <span className="font-semibold text-neutral-900">15% Off All Apothecary</span>
                  </div>
                </div>
              </div>

              {/* Redeem Gift Voucher */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Redeem Gift Card or Voucher
                </h3>
                <p className="text-xs text-neutral-500">
                  Have a digital gift voucher code? Enter it below to deposit the funds directly into your spa account.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGiftCode}
                    onChange={(e) => setNewGiftCode(e.target.value)}
                    placeholder="e.g. SERENE-GIFT-8921"
                    className="flex-1 bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 uppercase font-mono focus:outline-none focus:border-neutral-900"
                  />
                  <button
                    onClick={handleRedeemGiftCard}
                    className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer shadow-sm"
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalOpen && bookingToReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-neutral-200 text-neutral-900 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Reschedule Appointment
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {bookingToReschedule.service_name} with {bookingToReschedule.staff_name}
                </p>
              </div>
              <button
                onClick={() => setRescheduleModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 p-1 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Select New Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Select New Time Slot</label>
                {rescheduleSlots.length === 0 ? (
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-neutral-500 text-xs">
                    No openings for {bookingToReschedule.staff_name} on this date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                    {rescheduleSlots.map((slot) => (
                      <button
                        key={slot.start_time}
                        onClick={() => setSelectedRescheduleSlot(slot.start_time)}
                        className={`py-2 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                          selectedRescheduleSlot === slot.start_time
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {slot.start_time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setRescheduleModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 cursor-pointer"
              >
                Keep Current
              </button>
              <button
                onClick={handleConfirmReschedule}
                disabled={isRescheduling || !selectedRescheduleSlot}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white cursor-pointer shadow-sm"
              >
                {isRescheduling ? 'Rescheduling...' : 'Confirm Change'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalOpen && bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-neutral-200 text-neutral-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Cancel Appointment?
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {bookingToCancel.service_name} • {bookingToCancel.date}
                </p>
              </div>
              <button
                onClick={() => setCancelModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 p-1 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Are you sure you wish to release this appointment slot? Cancellations outside 24h are 100% refunded to your original payment method.
            </p>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              >
                <option value="Schedule conflict">Schedule conflict</option>
                <option value="Feeling unwell / illness">Feeling unwell / illness</option>
                <option value="Travel / out of town">Travel / out of town</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 cursor-pointer"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBookingForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-neutral-200 text-neutral-900 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Appointment Reference: {selectedBookingForDetail.id}
                </span>
                <h3 className="font-serif text-lg font-bold text-neutral-900 mt-0.5">
                  {selectedBookingForDetail.service_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForDetail(null)}
                className="text-neutral-400 hover:text-neutral-900 p-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Date & Time:</span>
                <span className="font-semibold text-neutral-900">
                  {selectedBookingForDetail.date} ({selectedBookingForDetail.start_time} - {selectedBookingForDetail.end_time})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Therapist:</span>
                <span className="font-semibold text-neutral-900">{selectedBookingForDetail.staff_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Status:</span>
                <span className="font-semibold capitalize text-neutral-900">{selectedBookingForDetail.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Price:</span>
                <span className="font-semibold text-neutral-900">${selectedBookingForDetail.price}</span>
              </div>
            </div>

            {selectedBookingForDetail.soap_note && (
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs">
                <strong className="text-neutral-900 block font-semibold">Therapist Treatment & Care Notes:</strong>
                <p className="text-neutral-600">{selectedBookingForDetail.soap_note.plan || 'Rest and stay hydrated with infused water.'}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBookingForDetail(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
