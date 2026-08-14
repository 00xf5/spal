import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import {
  Service,
  ServiceCategory,
  StaffProfile,
  User,
  Booking,
  AdminKPIs,
} from '../../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  Calendar,
  Layers,
  Users,
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle,
  Search,
  Save,
  X,
  Sparkles,
  Clock,
  ShoppingCart,
  Package,
  FileText,
  Bot,
  Receipt,
  Tag,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Building,
  RefreshCw,
  ExternalLink,
  Maximize2,
} from 'lucide-react';

interface RetailItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
}

const INITIAL_RETAIL_ITEMS: RetailItem[] = [
  {
    id: 'ret-1',
    name: 'Organic Cedarwood & Lavender Essential Oil (100ml)',
    category: 'Aromatherapy',
    price: 38,
    stock: 14,
    sku: 'BOT-CED-100',
  },
  {
    id: 'ret-2',
    name: 'Himalayan Pink Mineral Salt Body Scrub',
    category: 'Body Care',
    price: 45,
    stock: 8,
    sku: 'SALT-HIM-250',
  },
  {
    id: 'ret-3',
    name: 'Rose Quartz Facial Sculpting Gua Sha',
    category: 'Skincare Tools',
    price: 32,
    stock: 22,
    sku: 'GUA-RQ-01',
  },
  {
    id: 'ret-4',
    name: 'Herbal Scalp Treatment Elixir (50ml)',
    category: 'Hair & Scalp',
    price: 52,
    stock: 5,
    sku: 'SCALP-ELX-50',
  },
];

export const AdminDashboard: React.FC = () => {
  const {
    currentAdminTab,
    setCurrentAdminTab,
    setArea,
    showToast,
    triggerDataRefresh,
    dataVersion,
  } = useApp();

  // Core Data
  const [kpis, setKpis] = useState<AdminKPIs | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [staff, setStaff] = useState<(StaffProfile & User)[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [retailItems, setRetailItems] = useState<RetailItem[]>(INITIAL_RETAIL_ITEMS);

  // Search & Filter
  const [bookingSearch, setBookingSearch] = useState<string>('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');

  // POS State
  const [posSelectedClient, setPosSelectedClient] = useState<string>('Sarah Jenkins');
  const [posCart, setPosCart] = useState<{ item: any; type: 'service' | 'retail'; quantity: number }[]>([]);
  const [posTip, setPosTip] = useState<number>(20);
  const [posDiscount, setPosDiscount] = useState<number>(0);
  const [posPaymentMethod, setPosPaymentMethod] = useState<'card' | 'cash'>('card');
  const [posReceipt, setPosReceipt] = useState<any | null>(null);

  // Service Edit / Add Modal
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState<boolean>(false);
  const [serviceFormName, setServiceFormName] = useState<string>('');
  const [serviceFormDesc, setServiceFormDesc] = useState<string>('');
  const [serviceFormCat, setServiceFormCat] = useState<string>('cat-massage');
  const [serviceFormPrice, setServiceFormPrice] = useState<number>(180);
  const [serviceFormDuration, setServiceFormDuration] = useState<number>(60);
  const [serviceFormBuffer, setServiceFormBuffer] = useState<number>(15);

  // AI Advisor State
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Load Admin Data
  useEffect(() => {
    mockApi.getAdminKPIs().then(setKpis);
    mockApi.getBookings().then(setBookings);
    mockApi.getServices().then(setServices);
    mockApi.getCategories().then(setCategories);
    mockApi.getStaff().then(setStaff);
    mockApi.getClients().then(setClients);
  }, [dataVersion]);

  // Chart Data
  const revenueChartData = [
    { day: 'Mon', revenue: 2450, bookings: 14 },
    { day: 'Tue', revenue: 3100, bookings: 18 },
    { day: 'Wed', revenue: 2890, bookings: 16 },
    { day: 'Thu', revenue: 3400, bookings: 20 },
    { day: 'Fri', revenue: 4600, bookings: 26 },
    { day: 'Sat', revenue: 5800, bookings: 32 },
    { day: 'Sun', revenue: 5100, bookings: 29 },
  ];

  // POS Handlers
  const handleAddToCart = (item: any, type: 'service' | 'retail') => {
    const existing = posCart.find((c) => c.item.id === item.id && c.type === type);
    if (existing) {
      setPosCart(posCart.map((c) => (c.item.id === item.id && c.type === type ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setPosCart([...posCart, { item, type, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (idx: number) => {
    setPosCart(posCart.filter((_, i) => i !== idx));
  };

  const cartSubtotal = posCart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const cartDiscountAmt = (cartSubtotal * posDiscount) / 100;
  const cartTax = (cartSubtotal - cartDiscountAmt) * 0.085;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscountAmt + cartTax + posTip);

  const handleProcessCheckout = () => {
    if (posCart.length === 0) {
      showToast('Cart is empty. Select services or retail items.', 'warning');
      return;
    }
    const receipt = {
      receiptNumber: `POS-${Math.floor(100000 + Math.random() * 900000)}`,
      client: posSelectedClient,
      items: [...posCart],
      subtotal: cartSubtotal,
      discount: cartDiscountAmt,
      tax: cartTax,
      tip: posTip,
      total: cartTotal,
      method: posPaymentMethod,
      timestamp: new Date().toLocaleString(),
    };
    setPosReceipt(receipt);
    setPosCart([]);
    showToast(`Payment of $${cartTotal.toFixed(2)} processed successfully`, 'success');
  };

  // Service Save / Create
  const handleSaveService = async () => {
    if (!serviceFormName.trim()) {
      showToast('Please enter a service name', 'warning');
      return;
    }
    try {
      if (editingService) {
        await mockApi.updateService(editingService.id, {
          name: serviceFormName,
          description: serviceFormDesc,
          category_id: serviceFormCat,
          price: serviceFormPrice,
          duration_min: serviceFormDuration,
          buffer_min: serviceFormBuffer,
        });
        showToast('Service updated successfully', 'success');
      } else {
        await mockApi.createService({
          name: serviceFormName,
          description: serviceFormDesc,
          category_id: serviceFormCat,
          price: serviceFormPrice,
          duration_min: serviceFormDuration,
          buffer_min: serviceFormBuffer,
          active: true,
          popular: false,
          beforeAfterCare: {
            before: 'Please arrive 15 minutes before your scheduled appointment.',
            after: 'Stay hydrated and avoid heavy exertion post-treatment.',
          },
          availableStaffIds: ['staff-1', 'staff-2', 'staff-3', 'staff-4'],
          addons: [],
          contraindications: ['Standard health intake required'],
          imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        });
        showToast('New service added to menu', 'success');
      }
      setEditingService(null);
      setIsNewServiceModalOpen(false);
      triggerDataRefresh();
    } catch (e: any) {
      showToast('Failed to save service', 'error');
    }
  };

  const handleOpenEditService = (service: Service) => {
    setEditingService(service);
    setServiceFormName(service.name);
    setServiceFormDesc(service.description);
    setServiceFormCat(service.category_id);
    setServiceFormPrice(service.price);
    setServiceFormDuration(service.duration_min);
    setServiceFormBuffer(service.buffer_min || 15);
    setIsNewServiceModalOpen(true);
  };

  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceFormName('');
    setServiceFormDesc('');
    setServiceFormCat('cat-massage');
    setServiceFormPrice(180);
    setServiceFormDuration(60);
    setServiceFormBuffer(15);
    setIsNewServiceModalOpen(true);
  };

  // AI Operations Advisor
  const handleAskAiAdvisor = (query: string) => {
    setIsAiLoading(true);
    setAiPrompt(query);
    setTimeout(() => {
      if (query.includes('revenue') || query.includes('sales')) {
        setAiResponse(
          'Weekly Revenue Analysis: Revenue is currently trending +14% week-over-week driven by Saturday peak utilization (96% suite occupancy). Recommendation: Introduce early-week 10% incentives on Japanese Head Spa sessions (Tue-Wed 10am-2pm) to level room load.'
        );
      } else if (query.includes('staff') || query.includes('capacity')) {
        setAiResponse(
          'Therapist Capacity Forecast: Weekend demand exceeds current staff allocation by approximately 6 slots per day. Suggest adding an additional on-call therapist shift for Saturday afternoons to capture an estimated $1,200 in unfulfilled booking demand.'
        );
      } else {
        setAiResponse(
          'Operational Overview: All 4 treatment suites operating at normal temperature and sanitation targets. Average client review rating is 4.98/5.0 with zero safety contraindication incidents logged this week.'
        );
      }
      setIsAiLoading(false);
    }, 600);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.client_name?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.service_name?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.id.toLowerCase().includes(bookingSearch.toLowerCase());
    const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="admin-dashboard-container" className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* Top Admin Bar */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-neutral-900">
                Clinic Operations & Management
              </h1>
              <span className="text-xs text-neutral-500">
                Live Overview • San Francisco Main Clinic
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <nav className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs">
              {[
                { id: 'overview', label: 'Executive KPIs', icon: BarChart3 },
                { id: 'calendar', label: 'Suite Calendar', icon: Calendar },
                { id: 'bookings', label: 'Appointments Ledger', icon: FileText },
                { id: 'pos', label: 'POS Register', icon: ShoppingCart },
                { id: 'services', label: 'Services & Pricing', icon: Layers },
                { id: 'staff', label: 'Therapist Roster', icon: Users },
                { id: 'clients', label: 'Client CRM', icon: UserCheck },
                { id: 'inventory', label: 'Inventory', icon: Package },
                { id: 'ai-ops', label: 'AI Advisor', icon: Bot },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = currentAdminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`admin-tab-${tab.id}`}
                    onClick={() => setCurrentAdminTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* ===================== TAB: OVERVIEW ===================== */}
        {currentAdminTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Today&apos;s Revenue</span>
                  <DollarSign className="w-4 h-4 text-neutral-600" />
                </div>
                <div className="font-serif text-3xl font-bold text-neutral-900">
                  ${kpis?.todayRevenue || 4620}
                </div>
                <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+14.2% vs last week</span>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Appointments Today</span>
                  <Calendar className="w-4 h-4 text-neutral-600" />
                </div>
                <div className="font-serif text-3xl font-bold text-neutral-900">
                  {kpis?.todayBookingsCount || 24}
                </div>
                <div className="text-xs text-neutral-500">
                  20 Confirmed • 4 Completed
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Suite Utilization</span>
                  <Percent className="w-4 h-4 text-neutral-600" />
                </div>
                <div className="font-serif text-3xl font-bold text-neutral-900">
                  {kpis?.occupancyRate || 88}%
                </div>
                <div className="text-xs text-neutral-500">
                  Optimal capacity range (80-92%)
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                  <span>Registered Clients</span>
                  <Receipt className="w-4 h-4 text-neutral-600" />
                </div>
                <div className="font-serif text-3xl font-bold text-neutral-900">
                  {kpis?.totalClients || 142}
                </div>
                <div className="text-xs text-neutral-500">
                  Active loyalty membership base
                </div>
              </div>
            </div>

            {/* 7-Day Revenue & Appointments Chart */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    Weekly Revenue & Volume
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Daily gross treatment billings and total appointments completed.
                  </p>
                </div>
                <div className="text-xs font-semibold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-lg border border-neutral-200">
                  Total 7-Day Gross: $27,340
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#171717" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#171717" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#737373" fontSize={12} />
                    <YAxis stroke="#737373" fontSize={12} tickFormatter={(val) => `$${val}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '8px', color: '#171717' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue ($)"
                      stroke="#171717"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: CALENDAR ===================== */}
        {currentAdminTab === 'calendar' && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Treatment Suites Schedule Grid
                </h3>
                <p className="text-xs text-neutral-500">
                  Visual room utilization across all 4 clinic treatment chambers.
                </p>
              </div>
              <div className="text-xs font-semibold text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">
                Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { name: 'Suite 1: Hinoki Hydro', bookingsCount: 6, status: 'Active (Occupied)' },
                { name: 'Suite 2: Himalayan Salt', bookingsCount: 5, status: 'Active (Occupied)' },
                { name: 'Suite 3: Botanical Facial', bookingsCount: 7, status: 'Active (Occupied)' },
                { name: 'Suite 4: Couples Sanctuary', bookingsCount: 4, status: 'Available (Turnaround)' },
              ].map((suite, i) => (
                <div key={i} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-neutral-900">{suite.name}</strong>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block">
                    {suite.status}
                  </span>
                  <div className="space-y-2 pt-2 border-t border-neutral-200 text-xs text-neutral-600">
                    <div className="p-2 bg-white rounded border border-neutral-200">
                      <span className="font-semibold text-neutral-900 block">10:00 - 11:15 AM</span>
                      <span>Japanese Head Spa • S. Jenkins</span>
                    </div>
                    <div className="p-2 bg-white rounded border border-neutral-200">
                      <span className="font-semibold text-neutral-900 block">01:30 - 02:45 PM</span>
                      <span>Waterfall Therapy • M. Vance</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: BOOKINGS LEDGER ===================== */}
        {currentAdminTab === 'bookings' && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Master Appointments Ledger
                </h3>
                <p className="text-xs text-neutral-500">
                  Search, filter, and audit all clinic reservations across all dates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search client or service..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900 font-medium"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Ref ID</th>
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Treatment Service</th>
                    <th className="pb-3">Therapist</th>
                    <th className="pb-3">Date & Time</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-50 transition">
                      <td className="py-3 font-mono font-bold text-neutral-900">{b.bookingRef}</td>
                      <td className="py-3 font-semibold text-neutral-900">{b.client_name}</td>
                      <td className="py-3 text-neutral-700">{b.service_name}</td>
                      <td className="py-3 text-neutral-600">{b.staff_name}</td>
                      <td className="py-3 text-neutral-600">
                        {b.date} ({b.startTime})
                      </td>
                      <td className="py-3 font-semibold text-neutral-900">${b.price_paid}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            b.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : b.status === 'confirmed'
                              ? 'bg-neutral-100 text-neutral-800 border-neutral-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================== TAB: POS REGISTER ===================== */}
        {currentAdminTab === 'pos' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Standalone 5th Mode Banner */}
            <div className="bg-neutral-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-white text-neutral-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    Dedicated 5th Mode
                  </span>
                  <h3 className="font-serif font-bold text-base">Front Desk POS & Detachable Register</h3>
                </div>
                <p className="text-xs text-neutral-400">
                  Operate the register in full-screen terminal mode or pop it out into an independent dual-screen window so clients on other screens cannot see transactions.
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="open-pos-mode-btn"
                  onClick={() => setArea('pos')}
                  className="flex-1 sm:flex-initial bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Launch 5th Mode POS</span>
                </button>
                <button
                  id="detach-pos-from-admin-btn"
                  onClick={() => {
                    const url = window.location.origin + '/pos';
                    window.open(url, 'Serene_Spa_POS_Terminal', 'width=1200,height=850,menubar=no,toolbar=no,location=no,status=no');
                    showToast('Detached POS opened in standalone window', 'success');
                  }}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Detach Window</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Catalog (Services + Retail) */}
            <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 shadow-sm">
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Point of Sale (POS) Catalog
                </h3>
                <p className="text-xs text-neutral-500">
                  Click any service or retail apothecary item to add to the client&apos;s checkout cart.
                </p>
              </div>

              {/* Services */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                  Spa & Wellness Services
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.slice(0, 4).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleAddToCart(s, 'service')}
                      className="p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-neutral-50 hover:bg-white text-left transition cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <strong className="text-xs font-semibold text-neutral-900 block truncate max-w-[170px]">
                          {s.name}
                        </strong>
                        <span className="text-[11px] text-neutral-500">{s.duration_min} min</span>
                      </div>
                      <span className="font-serif font-bold text-sm text-neutral-900">${s.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Retail Products */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                  Apothecary & Retail Products
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {retailItems.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleAddToCart(r, 'retail')}
                      className="p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-neutral-50 hover:bg-white text-left transition cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <strong className="text-xs font-semibold text-neutral-900 block truncate max-w-[170px]">
                          {r.name}
                        </strong>
                        <span className="text-[11px] text-neutral-500">In stock: {r.stock}</span>
                      </div>
                      <span className="font-serif font-bold text-sm text-neutral-900">${r.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart & Checkout */}
            <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="font-serif text-lg font-bold text-neutral-900">Current Checkout</h3>
                <span className="text-xs text-neutral-500">{posCart.length} Items</span>
              </div>

              {/* Client Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Select Client</label>
                <select
                  value={posSelectedClient}
                  onChange={(e) => setPosSelectedClient(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 font-medium"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {posCart.length === 0 ? (
                  <div className="py-6 text-center text-neutral-400 text-xs">
                    Cart is empty. Select items from catalog.
                  </div>
                ) : (
                  posCart.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div>
                        <span className="font-semibold text-neutral-900 block truncate max-w-[180px]">
                          {c.item.name}
                        </span>
                        <span className="text-[11px] text-neutral-500">Qty: {c.quantity} • ${c.item.price} each</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">${c.item.price * c.quantity}</span>
                        <button
                          onClick={() => handleRemoveFromCart(i)}
                          className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Calculation Summary */}
              <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-neutral-900">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Discount (0%):</span>
                  <span>-${cartDiscountAmt.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Sales Tax (8.5%):</span>
                  <span>${cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600 items-center">
                  <span>Therapist Gratuity ($):</span>
                  <div className="flex gap-1">
                    {[15, 20, 30].map((tip) => (
                      <button
                        key={tip}
                        onClick={() => setPosTip(tip)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          posTip === tip
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        ${tip}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Charge:</span>
                  <span className="font-serif text-lg">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setPosPaymentMethod('card')}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    posPaymentMethod === 'card'
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card Terminal</span>
                </button>
                <button
                  onClick={() => setPosPaymentMethod('cash')}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    posPaymentMethod === 'cash'
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Cash Tender</span>
                </button>
              </div>

              <button
                onClick={handleProcessCheckout}
                disabled={posCart.length === 0}
                className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
              >
                Complete Payment (${cartTotal.toFixed(2)})
              </button>

              {posReceipt && (
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <strong className="text-neutral-900 font-bold">Receipt Generated</strong>
                    <span className="font-mono text-neutral-500">{posReceipt.receiptNumber}</span>
                  </div>
                  <p className="text-neutral-600">
                    Paid ${posReceipt.total.toFixed(2)} via {posReceipt.method.toUpperCase()} by {posReceipt.client}.
                  </p>
                </div>
              )}
            </div>
          </div>
          </div>
        )}

        {/* ===================== TAB: SERVICES & PRICING ===================== */}
        {currentAdminTab === 'services' && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Treatment Menu Catalog & Pricing
                </h3>
                <p className="text-xs text-neutral-500">
                  Manage treatment services, duration, room buffer intervals, and public prices.
                </p>
              </div>

              <button
                onClick={handleOpenAddService}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="p-5 rounded-xl border border-neutral-200 bg-white flex flex-col justify-between space-y-4 hover:border-neutral-400 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-base font-bold text-neutral-900">{s.name}</h4>
                      <span className="font-serif font-bold text-neutral-900 text-base">${s.price}</span>
                    </div>
                    <p className="text-xs text-neutral-600 line-clamp-2">{s.description}</p>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
                      <span>{s.duration_min} min session</span>
                      <span>•</span>
                      <span>+{s.buffer_min || 15}m turnaround buffer</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditService(s)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: STAFF ROSTER ===================== */}
        {currentAdminTab === 'staff' && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Licensed Therapists & Commission Splits
                </h3>
                <p className="text-xs text-neutral-500">
                  Manage provider credentials, performance ratings, and commission arrangements.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {staff.map((member) => (
                <div key={member.id} className="p-5 rounded-xl border border-neutral-200 bg-white flex gap-4 items-start shadow-xs">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-16 h-16 rounded-xl object-cover border border-neutral-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-bold text-neutral-900">{member.name}</h4>
                      <span className="text-xs font-semibold text-neutral-800">
                        Commission: {((member.commission_rate || 0.4) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 block">{member.title}</span>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {member.specialties.map((spec, i) => (
                        <span key={i} className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: CLIENT CRM ===================== */}
        {currentAdminTab === 'clients' && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-300">
            <div className="pb-3 border-b border-neutral-100">
              <h3 className="font-serif text-lg font-bold text-neutral-900">
                Client Profiles & Medical Intake CRM
              </h3>
              <p className="text-xs text-neutral-500">
                Client directory with membership status, documented allergies, and lifetime visits.
              </p>
            </div>

            <div className="divide-y divide-neutral-100">
              {clients.map((c) => (
                <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base font-bold text-neutral-900">{c.name}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200">
                        {c.profile?.memberTier || 'Gold Member'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      {c.email} • {c.phone}
                    </p>
                    {c.profile?.allergies && c.profile.allergies.length > 0 && (
                      <div className="text-[11px] text-red-700 font-medium pt-0.5">
                        Known Allergies: {c.profile.allergies.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="text-right text-xs">
                    <span className="font-semibold text-neutral-900 block">
                      Credits: ${c.profile?.creditsRemaining || 0}
                    </span>
                    <span className="text-neutral-500">Emergency: {c.profile?.emergency_contact?.name || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: INVENTORY ===================== */}
        {currentAdminTab === 'inventory' && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Inventory & Backbar Supply Stock
                </h3>
                <p className="text-xs text-neutral-500">
                  Track retail apothecary items, essential oils, and treatment room supplies.
                </p>
              </div>
            </div>

            <div className="divide-y divide-neutral-100">
              {retailItems.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <strong className="font-serif text-sm font-bold text-neutral-900 block">{item.name}</strong>
                    <span className="text-neutral-500">SKU: {item.sku} • {item.category}</span>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="font-serif font-bold text-sm text-neutral-900">${item.price}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded font-bold ${item.stock < 10 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-neutral-100 text-neutral-800'}`}>
                        {item.stock} in stock
                      </span>
                      <button
                        onClick={() => {
                          setRetailItems(retailItems.map((r) => (r.id === item.id ? { ...r, stock: r.stock + 10 } : r)));
                          showToast(`Restocked +10 units of ${item.name}`, 'success');
                        }}
                        className="px-3 py-1 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                      >
                        Restock +10
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: AI ADVISOR ===================== */}
        {currentAdminTab === 'ai-ops' && (
          <div className="max-w-3xl mx-auto bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in duration-300">
            <div>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-neutral-900" />
                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  Spa Operations AI Advisor
                </h3>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Ask analytical questions about capacity utilization, staff scheduling optimization, or revenue forecasting.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-700">Quick Analysis Queries:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Analyze weekly revenue trends & room utilization',
                  'Forecast weekend staff capacity and unfulfilled demand',
                  'Generate operational clinic safety and review summary',
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleAskAiAdvisor(q)}
                    className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-200 transition cursor-pointer font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {isAiLoading && (
              <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-xl text-center text-xs text-neutral-600 animate-pulse">
                Analyzing clinic telemetry and schedule bookings...
              </div>
            )}

            {aiResponse && !isAiLoading && (
              <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
                  <span>AI Advisor Analysis</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed font-light">{aiResponse}</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Service Add / Edit Modal */}
      {isNewServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-neutral-200 text-neutral-900 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <h3 className="font-serif text-lg font-bold text-neutral-900">
                {editingService ? 'Edit Treatment Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setIsNewServiceModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 p-1 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={serviceFormName}
                  onChange={(e) => setServiceFormName(e.target.value)}
                  placeholder="e.g. Japanese Waterfall Scalp Therapy"
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={serviceFormDesc}
                  onChange={(e) => setServiceFormDesc(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 resize-none focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={serviceFormPrice}
                    onChange={(e) => setServiceFormPrice(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={serviceFormDuration}
                    onChange={(e) => setServiceFormDuration(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Buffer (min)</label>
                  <input
                    type="number"
                    value={serviceFormBuffer}
                    onChange={(e) => setServiceFormBuffer(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsNewServiceModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveService}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer shadow-sm"
              >
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
