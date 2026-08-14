import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, Service, User, ClientProfile, StaffProfile } from '../types';
import { mockApi } from '../services/mockApi';

export type AppArea = 'public' | 'client' | 'staff' | 'admin' | 'pos';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  area: AppArea;
  setArea: (area: AppArea) => void;
  activeStaffId: string;
  setActiveStaffId: (id: string) => void;
  activeClientId: string;
  setActiveClientId: (id: string) => void;
  currentPublicTab: string;
  setCurrentPublicTab: (tab: string) => void;
  currentClientTab: string;
  setCurrentClientTab: (tab: string) => void;
  currentStaffTab: string;
  setCurrentStaffTab: (tab: string) => void;
  currentAdminTab: string;
  setCurrentAdminTab: (tab: string) => void;
  currentPosTab: string;
  setCurrentPosTab: (tab: string) => void;
  isPresentationMode: boolean;
  setIsPresentationMode: (val: boolean) => void;
  navigateTo: (area: AppArea, tab?: string) => void;
  bookingFlowOpen: boolean;
  openBookingFlow: (service?: Service, staffId?: string) => void;
  closeBookingFlow: () => void;
  preselectedService: Service | null;
  preselectedStaffId: string | null;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  dataVersion: number;
  triggerDataRefresh: () => void;
  staffList: (StaffProfile & User)[];
  currentStaffUser: (StaffProfile & User) | null;
  currentClientUser: (User & { profile: ClientProfile }) | null;
  resetAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to parse current path into { area, tab }
function parseUrlPath(pathname: string): { area: AppArea; tab?: string } {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
  const segments = cleanPath.split('/');

  if (!cleanPath || cleanPath === 'home') {
    return { area: 'public', tab: 'home' };
  }

  const first = segments[0]?.toLowerCase();
  const second = segments[1]?.toLowerCase();

  if (first === 'client') {
    return { area: 'client', tab: second || 'dashboard' };
  }
  if (first === 'staff') {
    return { area: 'staff', tab: second || 'dashboard' };
  }
  if (first === 'admin') {
    return { area: 'admin', tab: second || 'overview' };
  }
  if (first === 'pos' || first === 'register' || first === 'checkout') {
    return { area: 'pos', tab: second || 'register' };
  }

  // Public tabs (e.g. /services, /team, /memberships, /giftcards, /about, /faq)
  if (['services', 'rituals'].includes(first)) {
    return { area: 'public', tab: 'services' };
  }
  if (['team', 'specialists', 'practitioners'].includes(first)) {
    return { area: 'public', tab: 'team' };
  }
  if (['memberships', 'packages'].includes(first)) {
    return { area: 'public', tab: 'memberships' };
  }
  if (['giftcards', 'gifts'].includes(first)) {
    return { area: 'public', tab: 'giftcards' };
  }
  if (['about', 'spaces', 'sanctuary'].includes(first)) {
    return { area: 'public', tab: 'about' };
  }
  if (['faq', 'policies'].includes(first)) {
    return { area: 'public', tab: 'faq' };
  }

  return { area: 'public', tab: 'home' };
}

// Helper to construct URL path from state
function buildUrlPath(area: AppArea, tab: string): string {
  if (area === 'public') {
    if (tab === 'home' || !tab) return '/';
    return `/${tab}`;
  }
  if (area === 'client') {
    if (tab === 'dashboard' || !tab) return '/client';
    return `/client/${tab}`;
  }
  if (area === 'staff') {
    if (tab === 'dashboard' || !tab) return '/staff';
    return `/staff/${tab}`;
  }
  if (area === 'admin') {
    if (tab === 'overview' || !tab) return '/admin';
    return `/admin/${tab}`;
  }
  if (area === 'pos') {
    if (tab === 'register' || !tab) return '/pos';
    return `/pos/${tab}`;
  }
  return '/';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Parse initial route from browser URL
  const initialRoute = parseUrlPath(window.location.pathname);

  const [area, setAreaState] = useState<AppArea>(() => {
    return initialRoute.area || (localStorage.getItem('serene_spa_active_area') as AppArea) || 'public';
  });

  const [activeStaffId, setActiveStaffIdState] = useState<string>('staff-1');
  const [activeClientId, setActiveClientIdState] = useState<string>('client-1');

  // Presentation / Discreet mode (hides demo mode bar when presenting public/client view to clients)
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  // Sub-tabs for each role area
  const [currentPublicTab, setCurrentPublicTabState] = useState<string>(
    initialRoute.area === 'public' && initialRoute.tab ? initialRoute.tab : 'home'
  );
  const [currentClientTab, setCurrentClientTabState] = useState<string>(
    initialRoute.area === 'client' && initialRoute.tab ? initialRoute.tab : 'dashboard'
  );
  const [currentStaffTab, setCurrentStaffTabState] = useState<string>(
    initialRoute.area === 'staff' && initialRoute.tab ? initialRoute.tab : 'dashboard'
  );
  const [currentAdminTab, setCurrentAdminTabState] = useState<string>(
    initialRoute.area === 'admin' && initialRoute.tab ? initialRoute.tab : 'overview'
  );
  const [currentPosTab, setCurrentPosTabState] = useState<string>(
    initialRoute.area === 'pos' && initialRoute.tab ? initialRoute.tab : 'register'
  );

  // Synchronize browser URL whenever area or current active tab changes
  const syncUrl = useCallback((targetArea: AppArea, targetTab: string) => {
    const targetPath = buildUrlPath(targetArea, targetTab);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ area: targetArea, tab: targetTab }, '', targetPath);
    }
  }, []);

  // Listen for browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseUrlPath(window.location.pathname);
      setAreaState(parsed.area);
      if (parsed.area === 'public') setCurrentPublicTabState(parsed.tab || 'home');
      if (parsed.area === 'client') setCurrentClientTabState(parsed.tab || 'dashboard');
      if (parsed.area === 'staff') setCurrentStaffTabState(parsed.tab || 'dashboard');
      if (parsed.area === 'admin') setCurrentAdminTabState(parsed.tab || 'overview');
      if (parsed.area === 'pos') setCurrentPosTabState(parsed.tab || 'register');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync on initial mount if path was '/'
  useEffect(() => {
    const activeTab =
      area === 'public'
        ? currentPublicTab
        : area === 'client'
        ? currentClientTab
        : area === 'staff'
        ? currentStaffTab
        : area === 'admin'
        ? currentAdminTab
        : currentPosTab;
    const targetPath = buildUrlPath(area, activeTab);
    if (window.location.pathname !== targetPath) {
      window.history.replaceState({ area, tab: activeTab }, '', targetPath);
    }
  }, []);

  // Booking Flow modal/overlay state
  const [bookingFlowOpen, setBookingFlowOpen] = useState<boolean>(false);
  const [preselectedService, setPreselectedService] = useState<Service | null>(null);
  const [preselectedStaffId, setPreselectedStaffId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dataVersion, setDataVersion] = useState<number>(0);

  // Cached staff & client data
  const [staffList, setStaffList] = useState<(StaffProfile & User)[]>([]);
  const [currentClientUser, setCurrentClientUser] = useState<(User & { profile: ClientProfile }) | null>(null);

  const triggerDataRefresh = () => {
    setDataVersion((v) => v + 1);
  };

  const setArea = (newArea: AppArea) => {
    setAreaState(newArea);
    localStorage.setItem('serene_spa_active_area', newArea);
    let tab = 'home';
    if (newArea === 'client') tab = currentClientTab || 'dashboard';
    if (newArea === 'staff') tab = currentStaffTab || 'dashboard';
    if (newArea === 'admin') tab = currentAdminTab || 'overview';
    if (newArea === 'pos') tab = currentPosTab || 'register';
    if (newArea === 'public') tab = currentPublicTab || 'home';
    syncUrl(newArea, tab);
  };

  const setCurrentPublicTab = (tab: string) => {
    setCurrentPublicTabState(tab);
    if (area === 'public') syncUrl('public', tab);
  };

  const setCurrentClientTab = (tab: string) => {
    setCurrentClientTabState(tab);
    if (area === 'client') syncUrl('client', tab);
  };

  const setCurrentStaffTab = (tab: string) => {
    setCurrentStaffTabState(tab);
    if (area === 'staff') syncUrl('staff', tab);
  };

  const setCurrentAdminTab = (tab: string) => {
    setCurrentAdminTabState(tab);
    if (area === 'admin') syncUrl('admin', tab);
  };

  const setCurrentPosTab = (tab: string) => {
    setCurrentPosTabState(tab);
    if (area === 'pos') syncUrl('pos', tab);
  };

  const navigateTo = (newArea: AppArea, tab?: string) => {
    setAreaState(newArea);
    localStorage.setItem('serene_spa_active_area', newArea);
    if (newArea === 'public') {
      const targetTab = tab || 'home';
      setCurrentPublicTabState(targetTab);
      syncUrl('public', targetTab);
    } else if (newArea === 'client') {
      const targetTab = tab || 'dashboard';
      setCurrentClientTabState(targetTab);
      syncUrl('client', targetTab);
    } else if (newArea === 'staff') {
      const targetTab = tab || 'dashboard';
      setCurrentStaffTabState(targetTab);
      syncUrl('staff', targetTab);
    } else if (newArea === 'admin') {
      const targetTab = tab || 'overview';
      setCurrentAdminTabState(targetTab);
      syncUrl('admin', targetTab);
    } else if (newArea === 'pos') {
      const targetTab = tab || 'register';
      setCurrentPosTabState(targetTab);
      syncUrl('pos', targetTab);
    }
  };

  const setActiveStaffId = (id: string) => {
    setActiveStaffIdState(id);
    showToast(`Switched staff profile view to ${staffList.find((s) => s.id === id)?.name || id}`, 'info');
  };

  const setActiveClientId = (id: string) => {
    setActiveClientIdState(id);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openBookingFlow = (service?: Service, staffId?: string) => {
    setPreselectedService(service || null);
    setPreselectedStaffId(staffId || null);
    setBookingFlowOpen(true);
  };

  const closeBookingFlow = () => {
    setBookingFlowOpen(false);
    setPreselectedService(null);
    setPreselectedStaffId(null);
  };

  const resetAllData = async () => {
    await mockApi.resetMockData();
    triggerDataRefresh();
    showToast('Mock database reset to original factory state.', 'info');
  };

  // Load staff and client on mount / refresh
  useEffect(() => {
    let isMounted = true;
    mockApi.getAllStaffAdmin().then((list) => {
      if (isMounted) setStaffList(list);
    });
    mockApi.getClientById(activeClientId).then((cli) => {
      if (isMounted) setCurrentClientUser(cli);
    });
    return () => {
      isMounted = false;
    };
  }, [dataVersion, activeClientId]);

  const currentStaffUser = staffList.find((s) => s.id === activeStaffId) || staffList[0] || null;

  return (
    <AppContext.Provider
      value={{
        area,
        setArea,
        activeStaffId,
        setActiveStaffId,
        activeClientId,
        setActiveClientId,
        currentPublicTab,
        setCurrentPublicTab,
        currentClientTab,
        setCurrentClientTab,
        currentStaffTab,
        setCurrentStaffTab,
        currentAdminTab,
        setCurrentAdminTab,
        currentPosTab,
        setCurrentPosTab,
        isPresentationMode,
        setIsPresentationMode,
        navigateTo,
        bookingFlowOpen,
        openBookingFlow,
        closeBookingFlow,
        preselectedService,
        preselectedStaffId,
        toasts,
        showToast,
        dismissToast,
        dataVersion,
        triggerDataRefresh,
        staffList,
        currentStaffUser,
        currentClientUser,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

