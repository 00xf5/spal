import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBanner } from './components/common/RoleSwitcherBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { BookingModal } from './components/booking/BookingModal';
import { PublicSite } from './components/public/PublicSite';
import { ClientApp } from './components/client/ClientApp';
import { StaffPortal } from './components/staff/StaffPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { POSRegister } from './components/pos/POSRegister';

const AppContent: React.FC = () => {
  const { area } = useApp();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* Prototype Role Switcher Bar */}
      <RoleSwitcherBanner />

      {/* Main Workspace Area Switcher */}
      <main className="flex-1">
        {area === 'public' && <PublicSite />}
        {area === 'client' && <ClientApp />}
        {area === 'staff' && <StaffPortal />}
        {area === 'admin' && <AdminDashboard />}
        {area === 'pos' && <POSRegister />}
      </main>

      {/* Global Interactive Booking Wizard Modal */}
      <BookingModal />

      {/* Toast Notification Layer */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
