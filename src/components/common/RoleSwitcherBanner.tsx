import React from 'react';
import { useApp, AppArea } from '../../context/AppContext';
import {
  Globe,
  User,
  CalendarCheck,
  LayoutDashboard,
  CreditCard,
  RefreshCw,
  Sparkles,
  ExternalLink,
  EyeOff,
  Eye,
} from 'lucide-react';

export const RoleSwitcherBanner: React.FC = () => {
  const {
    area,
    setArea,
    activeStaffId,
    setActiveStaffId,
    staffList,
    currentClientUser,
    resetAllData,
    openBookingFlow,
    isPresentationMode,
    setIsPresentationMode,
    showToast,
  } = useApp();

  const areas: { id: AppArea; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: 'public', label: '1. Public Site', icon: Globe, desc: 'Services, Staff & Booking' },
    { id: 'client', label: '2. Client Portal', icon: User, desc: 'Appointments & Medical Profile' },
    { id: 'staff', label: '3. Staff Portal', icon: CalendarCheck, desc: 'Therapist Schedule & SOAP Notes' },
    { id: 'admin', label: '4. Admin Dash', icon: LayoutDashboard, desc: 'Analytics, Staff & Master Ledger' },
    { id: 'pos', label: '5. POS Register', icon: CreditCard, desc: 'Detachable Register & Front Desk POS' },
  ];

  const handleDetachPOS = () => {
    const url = window.location.origin + '/pos';
    const win = window.open(url, 'Serene_Spa_POS_Terminal', 'width=1200,height=850,menubar=no,toolbar=no,location=no,status=no');
    if (win) {
      showToast('Detached POS opened in standalone window', 'success');
    } else {
      showToast('Popup blocked. Please allow popups to open detached window.', 'warning');
    }
  };

  if (isPresentationMode) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          id="exit-presentation-mode-btn"
          onClick={() => setIsPresentationMode(false)}
          title="Exit Client Presentation Mode to show developer role bar"
          className="bg-neutral-900/90 hover:bg-neutral-900 text-white border border-neutral-700 px-3 py-1.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-neutral-300" />
          <span>Exit Client View (Show Modes)</span>
        </button>
      </div>
    );
  }

  return (
    <header id="role-switcher-banner" className="bg-neutral-900 text-neutral-100 border-b border-neutral-800 text-xs sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Role Switcher Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase mr-0.5 hidden sm:inline">
            Mode:
          </span>

          <nav className="flex items-center bg-neutral-800 p-0.5 rounded-lg border border-neutral-700 overflow-x-auto">
            {areas.map((tab) => {
              const Icon = tab.icon;
              const isActive = area === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`role-switch-${tab.id}`}
                  onClick={() => setArea(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-700/60'
                  }`}
                  title={tab.desc}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Role context & test actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {area === 'staff' && (
            <div className="flex items-center gap-1.5 bg-neutral-800 px-2.5 py-1 rounded-md border border-neutral-700">
              <span className="text-neutral-400">Therapist:</span>
              <select
                id="staff-select-dropdown"
                value={activeStaffId}
                onChange={(e) => setActiveStaffId(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.id} className="bg-neutral-800 text-white">
                    {s.name} ({s.specialties[0]})
                  </option>
                ))}
              </select>
            </div>
          )}

          {area === 'client' && (
            <div className="flex items-center gap-1.5 bg-neutral-800 px-2.5 py-1 rounded-md border border-neutral-700 text-neutral-300">
              <span className="text-neutral-400">Logged in:</span>
              <span className="text-white font-semibold">{currentClientUser?.name || 'Sarah Jenkins'}</span>
              <span className="bg-neutral-700 text-neutral-200 px-1.5 py-0.5 text-[10px] rounded font-bold uppercase">
                {currentClientUser?.profile.memberTier || 'Gold'}
              </span>
            </div>
          )}

          {area === 'pos' && (
            <button
              id="header-detach-pos-btn"
              onClick={handleDetachPOS}
              title="Open POS Register in detached dual-monitor popup window"
              className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer"
            >
              <ExternalLink className="w-3 h-3 text-neutral-400" />
              <span>Detach POS</span>
            </button>
          )}

          <button
            id="quick-book-button"
            onClick={() => openBookingFlow()}
            className="flex items-center gap-1.5 bg-white text-neutral-900 hover:bg-neutral-100 px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
            <span className="hidden sm:inline">Book Appointment</span>
            <span className="sm:hidden">Book</span>
          </button>

          {/* Client Presentation View (Hides mode switcher from clients) */}
          <button
            id="client-presentation-mode-btn"
            onClick={() => {
              setIsPresentationMode(true);
              showToast('Client Presentation Mode active. Mode bar hidden.', 'info');
            }}
            title="Hide the mode switcher banner while showing the public website or client portal to clients"
            className="flex items-center gap-1 text-neutral-400 hover:text-white px-2 py-1 rounded text-xs transition cursor-pointer"
          >
            <EyeOff className="w-3 h-3" />
            <span className="hidden md:inline">Client View</span>
          </button>

          <button
            id="reset-mock-data-btn"
            onClick={resetAllData}
            title="Reset database to initial clean state"
            className="flex items-center gap-1 text-neutral-400 hover:text-white px-2 py-1 rounded text-xs transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden lg:inline">Reset Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
