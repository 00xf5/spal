import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import { Booking, BookingStatus, StaffProfile, User } from '../../types';
import {
  Calendar,
  Clock,
  User as UserIcon,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Save,
  Sparkles,
  Phone,
  Mail,
  DollarSign,
  Check,
  X
} from 'lucide-react';

export const StaffPortal: React.FC = () => {
  const {
    currentStaffTab,
    setCurrentStaffTab,
    activeStaffId,
    setActiveStaffId,
    staffList,
    currentStaffUser,
    showToast,
    triggerDataRefresh,
    dataVersion,
  } = useApp();

  const [staffBookings, setStaffBookings] = useState<Booking[]>([]);
  const [selectedBookingForNotes, setSelectedBookingForNotes] = useState<Booking | null>(null);
  const [treatmentNotesInput, setTreatmentNotesInput] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  const [scheduleViewMode, setScheduleViewMode] = useState<'today' | 'all'>('today');

  // Load therapist's bookings
  useEffect(() => {
    mockApi.getBookings({ staffId: activeStaffId }).then(setStaffBookings);
  }, [activeStaffId, dataVersion]);

  // Sync treatment notes when a booking is selected
  useEffect(() => {
    if (selectedBookingForNotes) {
      setTreatmentNotesInput(selectedBookingForNotes.soap_note?.plan || selectedBookingForNotes.treatmentNotes || '');
    }
  }, [selectedBookingForNotes]);

  const todayStr = new Date().toISOString().split('T')[0];

  const todayBookings = staffBookings.filter(
    (b) => b.date === todayStr && b.status !== 'cancelled'
  );

  const displayedBookings = scheduleViewMode === 'today'
    ? todayBookings
    : staffBookings.filter((b) => b.status !== 'cancelled');

  // Therapist metrics
  const completedToday = todayBookings.filter((b) => b.status === 'completed').length;
  const commissionRate = currentStaffUser?.commission_rate || 0.4;
  const estimatedCommissionToday = todayBookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + b.price_paid * commissionRate, 0);

  const handleMarkComplete = async (bookingId: string) => {
    try {
      await mockApi.updateBookingStatus(bookingId, 'completed');
      showToast('Treatment session marked as completed', 'success');
      triggerDataRefresh();
      if (selectedBookingForNotes && selectedBookingForNotes.id === bookingId) {
        setSelectedBookingForNotes((prev) => (prev ? { ...prev, status: 'completed' } : null));
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to update status', 'error');
    }
  };

  const handleSaveTreatmentNotes = async () => {
    if (!selectedBookingForNotes) return;
    setIsSavingNotes(true);
    try {
      await mockApi.addTreatmentNotes(selectedBookingForNotes.id, treatmentNotesInput);
      showToast('Treatment care notes saved to client record', 'success');
      triggerDataRefresh();
      setSelectedBookingForNotes((prev) =>
        prev ? { ...prev, treatmentNotes: treatmentNotesInput } : null
      );
    } catch (e: any) {
      showToast(e.message || 'Failed to save notes', 'error');
    } finally {
      setIsSavingNotes(false);
    }
  };

  return (
    <div id="staff-portal-container" className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* Staff Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={currentStaffUser?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'}
              alt={currentStaffUser?.name}
              className="w-10 h-10 rounded-full object-cover border border-neutral-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-neutral-900">
                  {currentStaffUser?.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200 font-bold">
                  ★ {currentStaffUser?.rating} ({currentStaffUser?.reviewsCount} reviews)
                </span>
              </div>
              <span className="text-xs text-neutral-500 block -mt-0.5">
                {currentStaffUser?.title} • Licensed Specialist
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <nav className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs">
              <button
                id="staff-tab-dashboard"
                onClick={() => setCurrentStaffTab('dashboard')}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  currentStaffTab === 'dashboard'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Today&apos;s Schedule
              </button>
              <button
                id="staff-tab-calendar"
                onClick={() => setCurrentStaffTab('calendar')}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  currentStaffTab === 'calendar'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All Bookings & History
              </button>
              <button
                id="staff-tab-availability"
                onClick={() => setCurrentStaffTab('availability')}
                className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  currentStaffTab === 'availability'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Profile & Specialties
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* ===================== TAB: TODAY'S DASHBOARD ===================== */}
        {currentStaffTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Today&apos;s Schedule</span>
                  <Calendar className="w-4 h-4 text-neutral-600" />
                </div>
                <div className="font-serif text-3xl font-bold text-neutral-900">
                  {todayBookings.length} Sessions
                </div>
                <div className="text-xs text-neutral-500 font-medium">
                  {completedToday} Completed • {todayBookings.length - completedToday} Remaining
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Commission Earned (Today)</span>
                  <DollarSign className="w-4 h-4 text-neutral-600" />
                </div>
                <div className="font-serif text-3xl font-bold text-neutral-900">
                  ${estimatedCommissionToday.toFixed(0)}
                </div>
                <div className="text-xs text-neutral-500 font-medium">
                  At {(commissionRate * 100).toFixed(0)}% base provider split
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Client Rating</span>
                  <Sparkles className="w-4 h-4 text-neutral-600" />
                </div>
                <div className="font-serif text-3xl font-bold text-neutral-900">
                  ★ {currentStaffUser?.rating || '4.98'}
                </div>
                <div className="text-xs text-neutral-500 font-medium">
                  Based on {currentStaffUser?.reviewsCount || 85} verified reviews
                </div>
              </div>
            </div>

            {/* Today's Schedule Table */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    Appointments for Today ({todayStr})
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Review client intake contraindications, update status, and record clinical care notes.
                  </p>
                </div>
              </div>

              {todayBookings.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 text-xs">
                  No appointments scheduled for today.
                </div>
              ) : (
                <div className="space-y-4">
                  {todayBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white hover:border-neutral-400 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-neutral-900 bg-white px-2.5 py-1 rounded border border-neutral-200 shadow-xs">
                            {b.startTime} - {b.endTime}
                          </span>
                          <h4 className="font-serif text-base font-bold text-neutral-900">
                            {b.service_name}
                          </h4>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                              b.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-neutral-100 text-neutral-800 border-neutral-200'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600">
                          <span className="flex items-center gap-1">
                            <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                            Client: <strong className="text-neutral-900">{b.client_name}</strong>
                          </span>
                          <span>•</span>
                          <span>Location: {b.location_name || 'Main Sanctuary'}</span>
                          <span>•</span>
                          <span>${b.price_paid}</span>
                        </div>

                        {b.clientNotes && (
                          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <span>Client Note: {b.clientNotes}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBookingForNotes(b)}
                          className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-800 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-neutral-600" />
                          <span>SOAP Notes</span>
                        </button>

                        {b.status !== 'completed' && (
                          <button
                            onClick={() => handleMarkComplete(b.id)}
                            className="px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Completed</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB: CALENDAR & ALL BOOKINGS ===================== */}
        {currentStaffTab === 'calendar' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  Full Appointment Roster
                </h3>
                <p className="text-xs text-neutral-500">
                  View all upcoming sessions and past completed treatment histories.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {staffBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 bg-white border border-neutral-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base font-bold text-neutral-900">
                        {b.service_name}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200">
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Client: <strong className="text-neutral-900">{b.client_name}</strong> • Date: {b.date} ({b.startTime} - {b.endTime})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedBookingForNotes(b)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                    >
                      Care Notes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: AVAILABILITY & SPECIALTIES ===================== */}
        {currentStaffTab === 'availability' && currentStaffUser && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 shadow-sm">
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  Therapist Profile & Working Hours
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Configure your bio, specialties, and standard operating shifts.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Public Bio</label>
                  <textarea
                    rows={3}
                    defaultValue={currentStaffUser.bio}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Clinical Specialties</label>
                  <div className="flex flex-wrap gap-1.5">
                    {currentStaffUser.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-xs bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-200 font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => showToast('Profile settings saved', 'success')}
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Treatment / SOAP Notes Modal */}
      {selectedBookingForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-neutral-200 text-neutral-900 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Treatment & SOAP Notes
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Client: {selectedBookingForNotes.client_name} • {selectedBookingForNotes.service_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedBookingForNotes(null)}
                className="text-neutral-400 hover:text-neutral-900 p-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-neutral-700">
                Therapist Notes (Findings, Pressure Used, Recommendations)
              </label>
              <textarea
                rows={5}
                value={treatmentNotesInput}
                onChange={(e) => setTreatmentNotesInput(e.target.value)}
                placeholder="Subjective: Client reported left trapezius tension. Objective: Applied heated Himalayan stones with medium-firm pressure. Plan: Recommended daily upper-back stretches and hydration."
                className="w-full bg-white border border-neutral-200 rounded-lg p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 leading-relaxed"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedBookingForNotes(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTreatmentNotes}
                disabled={isSavingNotes}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingNotes ? 'Saving...' : 'Save to Record'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
