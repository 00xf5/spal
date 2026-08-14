import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockApi } from '../../services/mockApi';
import {
  Service,
  ServiceCategory,
  User,
  Booking,
  StaffProfile,
} from '../../types';
import {
  ShoppingCart,
  DollarSign,
  CreditCard,
  Receipt,
  Search,
  Plus,
  Minus,
  Trash2,
  Tag,
  ExternalLink,
  Monitor,
  Maximize2,
  Minimize2,
  CheckCircle2,
  X,
  Printer,
  Mail,
  Smartphone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Gift,
  UserCheck,
  Clock,
  Layers,
  ChevronRight,
  Eye,
  EyeOff,
  Percent,
} from 'lucide-react';

export interface RetailProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  description?: string;
  barcode?: string;
}

export const INITIAL_RETAIL_PRODUCTS: RetailProduct[] = [
  {
    id: 'ret-1',
    name: 'Organic Cedarwood & Lavender Essential Oil (100ml)',
    category: 'Aromatherapy',
    price: 38,
    stock: 14,
    sku: 'BOT-CED-100',
    barcode: '840192837401',
    description: 'Cold-pressed calming botanical essence for relaxation.',
  },
  {
    id: 'ret-2',
    name: 'Himalayan Pink Mineral Salt Body Scrub (300g)',
    category: 'Body Care',
    price: 45,
    stock: 8,
    sku: 'SALT-HIM-250',
    barcode: '840192837402',
    description: 'Exfoliating detoxifying salt infused with jojoba oil.',
  },
  {
    id: 'ret-3',
    name: 'Rose Quartz Facial Sculpting Gua Sha Stone',
    category: 'Skincare Tools',
    price: 32,
    stock: 22,
    sku: 'GUA-RQ-01',
    barcode: '840192837403',
    description: 'Hand-carved gemstone tool for lymphatic drainage.',
  },
  {
    id: 'ret-4',
    name: 'Herbal Scalp Treatment Elixir (50ml)',
    category: 'Hair & Scalp',
    price: 52,
    stock: 5,
    sku: 'SCALP-ELX-50',
    barcode: '840192837404',
    description: 'Rosemary & peptides stimulating serum.',
  },
  {
    id: 'ret-5',
    name: 'Botanical Silk Sleep Eye Mask',
    category: 'Wellness',
    price: 28,
    stock: 19,
    sku: 'SLP-MSK-01',
    barcode: '840192837405',
    description: 'Pure 22-momme mulberry silk light-blocking mask.',
  },
  {
    id: 'ret-6',
    name: 'Thermal Deep Muscle Arnica Balm (120ml)',
    category: 'Body Care',
    price: 48,
    stock: 11,
    sku: 'BLM-ARN-120',
    barcode: '840192837406',
    description: 'High-potency warming relief ointment for sore muscles.',
  },
];

interface CartItem {
  id: string;
  item: Service | RetailProduct;
  type: 'service' | 'retail';
  quantity: number;
  selectedStaffId?: string;
  selectedStaffName?: string;
  customPrice?: number;
  addons?: { name: string; price: number }[];
}

export const POSRegister: React.FC = () => {
  const { showToast, triggerDataRefresh, dataVersion, staffList } = useApp();

  // Core Data
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [retailProducts] = useState<RetailProduct[]>(INITIAL_RETAIL_PRODUCTS);

  // Filter & Search
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [catalogType, setCatalogType] = useState<'all' | 'services' | 'retail' | 'unbilled'>('all');

  // Register / Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('client-1');
  const [tipAmount, setTipAmount] = useState<number>(25);
  const [customTipInput, setCustomTipInput] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'giftcard' | 'account'>('card');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [giftCardCode, setGiftCardCode] = useState<string>('');
  const [giftCardBalanceApplied, setGiftCardBalanceApplied] = useState<number>(0);

  // Detachable / Window / Display State
  const [isCustomerDisplayOpen, setIsCustomerDisplayOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedReceipt, setCompletedReceipt] = useState<any | null>(null);
  const [showZReport, setShowZReport] = useState<boolean>(false);

  // Initial Load
  useEffect(() => {
    mockApi.getServices().then(setServices);
    mockApi.getCategories().then(setCategories);
    mockApi.getClients().then(setClients);
    mockApi.getBookings().then((res) => {
      // Unbilled or today's appointments
      setTodayBookings(res);
    });
  }, [dataVersion]);

  // Selected client object
  const currentClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => {
    const base = item.customPrice !== undefined ? item.customPrice : item.item.price;
    const addonsTotal = item.addons?.reduce((a, b) => a + b.price, 0) || 0;
    return sum + (base + addonsTotal) * item.quantity;
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxRate = 0.0825; // 8.25%
  const salesTax = taxableAmount * taxRate;
  const effectiveTip = customTipInput !== '' ? parseFloat(customTipInput) || 0 : tipAmount;
  const grossTotal = taxableAmount + salesTax + effectiveTip;
  const netDue = Math.max(0, grossTotal - giftCardBalanceApplied);
  const cashChange = cashTendered > netDue ? cashTendered - netDue : 0;

  // Add Item to Cart
  const handleAddToCart = (item: Service | RetailProduct, type: 'service' | 'retail') => {
    const existingIndex = cart.findIndex((c) => c.item.id === item.id && c.type === type);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        item,
        type,
        quantity: 1,
        selectedStaffId: type === 'service' ? (staffList[0]?.id || 'staff-1') : undefined,
        selectedStaffName: type === 'service' ? (staffList[0]?.name || 'Elena Rostova') : undefined,
      };
      setCart([...cart, newItem]);
    }
  };

  // Add Unbilled Booking to Cart
  const handleAddBookingToCart = (booking: Booking) => {
    const matchedService = services.find((s) => s.id === booking.service_id) || {
      id: booking.service_id,
      name: booking.service_name,
      price: booking.price_paid,
      category_id: 'cat-massage',
      description: 'Scheduled Session',
      duration_min: 60,
      buffer_min: 15,
      active: true,
      popular: false,
      beforeAfterCare: { before: '', after: '' },
      availableStaffIds: [],
      addons: [],
      contraindications: [],
      imageUrl: '',
    };

    const newItem: CartItem = {
      id: `booking-${booking.id}`,
      item: matchedService,
      type: 'service',
      quantity: 1,
      selectedStaffId: booking.staff_id,
      selectedStaffName: booking.staff_name,
      customPrice: booking.price_paid,
    };

    // Auto switch to client if available
    const clientMatch = clients.find((c) => c.name.toLowerCase() === booking.client_name.toLowerCase());
    if (clientMatch) {
      setSelectedClientId(clientMatch.id);
    }

    setCart([...cart, newItem]);
    showToast(`Added ${booking.client_name}'s ${booking.service_name} to cart`, 'info');
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    setCart(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  // Discount code applicator
  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    if (code === 'SERENE10') {
      setDiscountPercent(10);
      setAppliedPromo('SERENE10 (10% Off)');
      showToast('10% Promo Code Applied', 'success');
    } else if (code === 'VIP15' || code === 'GOLD15') {
      setDiscountPercent(15);
      setAppliedPromo('VIP Member (15% Off)');
      showToast('15% VIP Promo Applied', 'success');
    } else if (code === 'STAFF50') {
      setDiscountPercent(50);
      setAppliedPromo('Staff Courtesy (50% Off)');
      showToast('50% Staff Discount Applied', 'success');
    } else if (code === 'RESET' || code === '') {
      setDiscountPercent(0);
      setAppliedPromo(null);
    } else {
      showToast('Invalid promo code. Try SERENE10 or VIP15', 'warning');
    }
  };

  // Gift card balance check & apply
  const handleApplyGiftCard = () => {
    if (!giftCardCode) {
      showToast('Please enter a gift card or voucher code', 'warning');
      return;
    }
    const simulatedGiftBalance = 75.0;
    const amountToApply = Math.min(simulatedGiftBalance, grossTotal);
    setGiftCardBalanceApplied(amountToApply);
    showToast(`Redeemed $${amountToApply.toFixed(2)} from Card #${giftCardCode.toUpperCase()}`, 'success');
  };

  // Detach to Standalone Window
  const handleDetachToWindow = () => {
    const url = window.location.origin + '/pos';
    const win = window.open(url, 'Serene_Spa_POS_Terminal', 'width=1200,height=850,menubar=no,toolbar=no,location=no,status=no');
    if (win) {
      showToast('Detached POS opened in dedicated standalone window', 'success');
    } else {
      showToast('Popup blocked by browser. Please allow popups to detach window.', 'warning');
    }
  };

  // Process Checkout
  const handleProcessCheckout = async () => {
    if (cart.length === 0) {
      showToast('Cart is empty. Add services or retail products.', 'warning');
      return;
    }

    setIsProcessing(true);
    // Simulate terminal authorization
    setTimeout(() => {
      setIsProcessing(false);
      const receiptData = {
        receiptNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
        clientName: currentClient?.name || 'Walk-in Guest',
        clientEmail: currentClient?.email || 'guest@sanctuary.com',
        timestamp: new Date().toLocaleString(),
        items: [...cart],
        subtotal,
        discountPercent,
        discountAmount,
        salesTax,
        tipAmount: effectiveTip,
        total: grossTotal,
        amountPaid: netDue,
        giftCardApplied: giftCardBalanceApplied,
        paymentMethod,
        changeGiven: paymentMethod === 'cash' ? cashChange : 0,
        authCode: `AUTH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        cashier: 'Front Desk Terminal #1',
      };

      setCompletedReceipt(receiptData);
      setCart([]);
      setCashTendered(0);
      setGiftCardBalanceApplied(0);
      setGiftCardCode('');
      setDiscountPercent(0);
      setAppliedPromo(null);
      setCustomTipInput('');
      setTipAmount(25);
      showToast('Transaction approved and receipt generated!', 'success');
      triggerDataRefresh();
    }, 900);
  };

  // Filter Catalog Items
  const filteredServices = services.filter((s) => {
    const matchesCat = activeCategory === 'all' || s.category_id === activeCategory;
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const filteredRetail = retailProducts.filter((r) => {
    const matchesCat = activeCategory === 'all' || r.category.toLowerCase().includes(activeCategory.replace('cat-', ''));
    const matchesQuery =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.barcode && r.barcode.includes(searchQuery));
    return matchesCat && matchesQuery;
  });

  return (
    <div id="pos-register-container" className="bg-neutral-50 min-h-screen text-neutral-900 flex flex-col font-sans">
      {/* Top POS Terminal Navigation Bar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 px-6 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-serif font-bold text-base shadow-sm">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg text-neutral-900 tracking-tight">Front Desk POS & Register</h1>
                <span className="bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-300">
                  Terminal #1
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Live Ready
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Independent retail & appointment checkout station with dual-screen and detachable window support
              </p>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Detach Standalone Window */}
            <button
              id="detach-pos-window-btn"
              onClick={handleDetachToWindow}
              title="Pop out POS Register into an independent floating desktop window for multi-monitor setups"
              className="flex items-center gap-1.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-600" />
              <span>Detach to Window</span>
            </button>

            {/* Customer Facing Display Mode */}
            <button
              id="customer-display-toggle-btn"
              onClick={() => setIsCustomerDisplayOpen(!isCustomerDisplayOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                isCustomerDisplayOpen
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300 shadow-xs'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{isCustomerDisplayOpen ? 'Close Client Screen' : 'Customer Display'}</span>
            </button>

            {/* Cash Drawer Simulator */}
            <button
              id="open-cash-drawer-btn"
              onClick={() => {
                setIsDrawerOpen(true);
                showToast('Cash drawer kicked open (Tone / Relay Signal Sent)', 'info');
                setTimeout(() => setIsDrawerOpen(false), 2500);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                isDrawerOpen
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-300 shadow-xs'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>{isDrawerOpen ? 'Drawer Open' : 'Open Drawer'}</span>
            </button>

            {/* Z-Report / Shift Close */}
            <button
              id="shift-summary-btn"
              onClick={() => setShowZReport(true)}
              className="flex items-center gap-1.5 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5 text-neutral-500" />
              <span>Shift Z-Report</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace: Left Catalog + Right Cart */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Section: Catalog, Services, Retail & Unbilled Bookings (7 cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col">
          {/* Catalog Top Filter Strip */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Type Switcher */}
              <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-semibold">
                <button
                  onClick={() => setCatalogType('all')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    catalogType === 'all' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setCatalogType('services')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    catalogType === 'services' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Services ({services.length})
                </button>
                <button
                  onClick={() => setCatalogType('retail')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    catalogType === 'retail' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Retail & Oils ({retailProducts.length})
                </button>
                <button
                  onClick={() => setCatalogType('unbilled')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    catalogType === 'unbilled' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span>Unbilled</span>
                  <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-bold">
                    {todayBookings.length}
                  </span>
                </button>
              </div>

              {/* Barcode / Text Search Input */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search item name, SKU, or scan barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills (when not unbilled) */}
            {catalogType !== 'unbilled' && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition cursor-pointer ${
                    activeCategory === 'all'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition cursor-pointer ${
                      activeCategory === c.id
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Catalog Grid View */}
          <div className="flex-1 bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs overflow-y-auto max-h-[620px]">
            {/* View 1: Unbilled Appointments */}
            {catalogType === 'unbilled' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <h3 className="font-serif font-bold text-sm text-neutral-900">Today's Scheduled Appointments</h3>
                  <span className="text-xs text-neutral-500">Click appointment to ring up directly</span>
                </div>

                {todayBookings.length === 0 ? (
                  <div className="py-12 text-center text-neutral-400 text-xs">
                    No unbilled appointments pending checkout.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {todayBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => handleAddBookingToCart(b)}
                        className="p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50/70 transition cursor-pointer flex flex-col justify-between space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-neutral-900 block group-hover:text-neutral-950">
                              {b.client_name}
                            </span>
                            <span className="text-[11px] text-neutral-500">{b.service_name}</span>
                          </div>
                          <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                            ${b.price_paid}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-2 border-t border-neutral-100">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            {b.startTime} - {b.endTime}
                          </span>
                          <span className="font-medium text-neutral-700">Therapist: {b.staff_name}</span>
                        </div>

                        <button className="w-full mt-1 bg-neutral-900 group-hover:bg-neutral-800 text-white text-[11px] font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1 transition">
                          <Plus className="w-3 h-3" />
                          <span>Ring Up Checkout</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Services Section */}
                {(catalogType === 'all' || catalogType === 'services') && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-serif font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Spa Treatments & Massages</span>
                      </h3>
                      <span className="text-[11px] text-neutral-500">{filteredServices.length} options</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {filteredServices.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => handleAddToCart(service, 'service')}
                          className="text-left p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 transition cursor-pointer flex flex-col justify-between space-y-2 group shadow-2xs"
                        >
                          <div>
                            <span className="font-serif font-bold text-xs text-neutral-900 block group-hover:text-neutral-950">
                              {service.name}
                            </span>
                            <span className="text-[11px] text-neutral-500 line-clamp-1">{service.duration_min} min session</span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="font-serif font-bold text-sm text-neutral-900">${service.price}</span>
                            <span className="w-6 h-6 rounded-md bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white text-neutral-700 flex items-center justify-center text-xs font-bold transition">
                              +
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Retail Products Section */}
                {(catalogType === 'all' || catalogType === 'retail') && (
                  <div className="pt-4 border-t border-neutral-100">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-serif font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Botanical Retail & Oils</span>
                      </h3>
                      <span className="text-[11px] text-neutral-500">{filteredRetail.length} products</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {filteredRetail.map((prod) => (
                        <button
                          key={prod.id}
                          onClick={() => handleAddToCart(prod, 'retail')}
                          className="text-left p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 transition cursor-pointer flex flex-col justify-between space-y-2 group shadow-2xs"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-[10px] font-mono text-neutral-400 font-medium">{prod.sku}</span>
                              <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.2 rounded">
                                Stock: {prod.stock}
                              </span>
                            </div>
                            <span className="font-serif font-bold text-xs text-neutral-900 block group-hover:text-neutral-950">
                              {prod.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="font-serif font-bold text-sm text-neutral-900">${prod.price}</span>
                            <span className="w-6 h-6 rounded-md bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white text-neutral-700 flex items-center justify-center text-xs font-bold transition">
                              +
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Register Cart, Client Info, Discounts & Checkout (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Header & Client Selector */}
            <div className="space-y-3 pb-3 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-neutral-900" />
                  <h2 className="font-serif font-bold text-base text-neutral-900">Current Cart</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                    {cart.reduce((a, b) => a + b.quantity, 0)} items
                  </span>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Client Selection Box */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                  Assigned Guest / Client Account
                </label>
                <div className="relative">
                  <select
                    id="pos-client-select"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white transition cursor-pointer"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} • {c.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-neutral-400 text-xs space-y-1">
                  <ShoppingCart className="w-6 h-6 mx-auto text-neutral-300 stroke-[1.5]" />
                  <p>Register cart is empty.</p>
                  <p className="text-[11px] text-neutral-400">Click any service or retail item to ring up.</p>
                </div>
              ) : (
                cart.map((item, idx) => {
                  const basePrice = item.customPrice !== undefined ? item.customPrice : item.item.price;
                  return (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                              item.type === 'service'
                                ? 'bg-neutral-900 text-white border-neutral-900'
                                : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                            }`}
                          >
                            {item.type}
                          </span>
                          <span className="font-semibold text-neutral-900 truncate block">{item.item.name}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-2">
                          <span>${basePrice.toFixed(2)} ea</span>
                          {item.type === 'service' && item.selectedStaffName && (
                            <span>• Therapist: {item.selectedStaffName}</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity adjuster */}
                      <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-lg p-0.5 shadow-2xs">
                        <button
                          onClick={() => handleUpdateQuantity(idx, -1)}
                          className="w-5 h-5 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-600 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs px-1 text-neutral-900">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(idx, 1)}
                          className="w-5 h-5 rounded hover:bg-neutral-100 flex items-center justify-center text-neutral-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right min-w-[50px]">
                        <span className="font-bold text-neutral-900 block font-mono">
                          ${(basePrice * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          className="text-[10px] text-neutral-400 hover:text-red-600 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Discount & Promo Code Section */}
            <div className="pt-3 border-t border-neutral-100 space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Promo Code (e.g. SERENE10, VIP15)"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 uppercase font-mono tracking-wider focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <button
                  onClick={handleApplyDiscount}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  <span className="font-medium">Active Discount: {appliedPromo}</span>
                  <button
                    onClick={() => {
                      setDiscountPercent(0);
                      setAppliedPromo(null);
                      setDiscountCode('');
                    }}
                    className="text-neutral-500 hover:text-neutral-800 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Gratuity / Tip Selection */}
            <div className="pt-3 border-t border-neutral-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-700">Therapist Gratuity</span>
                <span className="font-mono font-bold text-neutral-900">${effectiveTip.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[15, 20, 25, 30].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTipAmount(t);
                      setCustomTipInput('');
                    }}
                    className={`py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer text-center ${
                      tipAmount === t && customTipInput === ''
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    ${t}
                  </button>
                ))}
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="pt-3 border-t border-neutral-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold text-neutral-900">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({discountPercent}%):</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Sales Tax (8.25%):</span>
                <span className="font-mono">${salesTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Gratuity:</span>
                <span className="font-mono">${effectiveTip.toFixed(2)}</span>
              </div>

              {giftCardBalanceApplied > 0 && (
                <div className="flex justify-between text-indigo-700 font-semibold pt-1">
                  <span>Gift Card Applied:</span>
                  <span className="font-mono">-${giftCardBalanceApplied.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-2 border-t border-neutral-200">
                <span className="font-serif font-bold text-sm text-neutral-900">Total Net Due:</span>
                <span className="font-serif font-bold text-xl text-neutral-900 font-mono">${netDue.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-3 border-t border-neutral-100 space-y-2">
              <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider">
                Select Tender Method
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-1 rounded-xl font-semibold border flex flex-col items-center gap-1 transition cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card EMV</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-2 px-1 rounded-xl font-semibold border flex flex-col items-center gap-1 transition cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Cash Drawer</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('giftcard')}
                  className={`py-2 px-1 rounded-xl font-semibold border flex flex-col items-center gap-1 transition cursor-pointer ${
                    paymentMethod === 'giftcard'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  <span>Gift Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('account')}
                  className={`py-2 px-1 rounded-xl font-semibold border flex flex-col items-center gap-1 transition cursor-pointer ${
                    paymentMethod === 'account'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Member Tab</span>
                </button>
              </div>

              {/* Cash Tender Details */}
              {paymentMethod === 'cash' && (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 font-medium">Cash Tendered:</span>
                    <input
                      type="number"
                      value={cashTendered || ''}
                      onChange={(e) => setCashTendered(parseFloat(e.target.value) || 0)}
                      placeholder={`$${Math.ceil(netDue)}`}
                      className="w-24 px-2 py-1 bg-white border border-neutral-300 rounded text-right font-mono font-bold focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-neutral-700">Change Due Back:</span>
                    <span className="font-mono text-emerald-700 text-sm">${cashChange.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-1 pt-1">
                    {[Math.ceil(netDue), 100, 150, 200].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setCashTendered(amt)}
                        className="flex-1 py-1 bg-white border border-neutral-200 rounded text-[11px] font-semibold hover:bg-neutral-100"
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gift Card Input */}
              {paymentMethod === 'giftcard' && (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter 16-Digit Gift Card Number"
                      value={giftCardCode}
                      onChange={(e) => setGiftCardCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 rounded font-mono uppercase text-xs focus:outline-none focus:border-neutral-900"
                    />
                    <button
                      onClick={handleApplyGiftCard}
                      className="bg-neutral-900 text-white px-3 py-1.5 rounded font-semibold text-xs hover:bg-neutral-800"
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Complete Transaction Action */}
            <button
              id="process-pos-checkout-btn"
              onClick={handleProcessCheckout}
              disabled={isProcessing || cart.length === 0}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                cart.length === 0
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authorizing Payment Terminal...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Charge ${netDue.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Customer Facing Display Modal / Overlay */}
      {isCustomerDisplayOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-neutral-200 shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-neutral-900 flex items-center justify-center font-serif font-bold">
                  S
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base">Serene Sanctuary Customer Terminal</h3>
                  <p className="text-[11px] text-neutral-400">Guest Checkout Screen</p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomerDisplayOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clean Guest Screen Content */}
            <div className="p-8 space-y-6">
              <div className="text-center space-y-1">
                <h4 className="font-serif text-2xl font-bold text-neutral-900">
                  Welcome, {currentClient?.name || 'Guest'}
                </h4>
                <p className="text-xs text-neutral-500">Please review your sanctuary treatment and items</p>
              </div>

              {/* Itemized list */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 max-h-48 overflow-y-auto space-y-2">
                {cart.length === 0 ? (
                  <div className="text-center py-6 text-neutral-400 text-xs">Waiting for receptionist to ring items...</div>
                ) : (
                  cart.map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-neutral-100 last:border-0">
                      <div>
                        <span className="font-semibold text-neutral-900">{c.item.name}</span>
                        <span className="text-xs text-neutral-500 block">Qty: {c.quantity}</span>
                      </div>
                      <span className="font-bold text-neutral-900 font-mono">
                        ${((c.customPrice !== undefined ? c.customPrice : c.item.price) * c.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Total Due Banner */}
              <div className="bg-neutral-900 text-white p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block uppercase tracking-wider font-semibold">Total Amount</span>
                  <span className="text-xs text-neutral-300">Including taxes & gratuity</span>
                </div>
                <div className="font-serif text-3xl font-bold font-mono">${netDue.toFixed(2)}</div>
              </div>

              <div className="text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Contactless Apple Pay, Google Pay, and Chip Cards Supported</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Receipt Modal */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-neutral-200 shadow-2xl p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-neutral-900">Payment Approved</h3>
              <p className="text-xs text-neutral-500">Transaction #{completedReceipt.receiptNumber}</p>
            </div>

            {/* Printable Receipt Paper Container */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs font-mono space-y-2">
              <div className="text-center pb-2 border-b border-dashed border-neutral-300">
                <strong className="block text-sm font-serif font-bold text-neutral-900">SERENE BOTANICAL SANCTUARY</strong>
                <span className="text-[10px] text-neutral-500">450 Wellness Way, Suite 400 • (415) 890-4321</span>
                <span className="block text-[10px] text-neutral-400 mt-1">{completedReceipt.timestamp}</span>
              </div>

              <div className="py-2 border-b border-dashed border-neutral-300 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-500">Client:</span>
                  <span className="font-bold text-neutral-900">{completedReceipt.clientName}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-500">Method:</span>
                  <span className="uppercase font-bold text-neutral-900">{completedReceipt.paymentMethod}</span>
                </div>
              </div>

              {/* Items */}
              <div className="py-2 border-b border-dashed border-neutral-300 space-y-1.5">
                {completedReceipt.items.map((it: CartItem, idx: number) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="truncate max-w-[200px]">
                      {it.quantity}x {it.item.name}
                    </span>
                    <span>
                      ${((it.customPrice !== undefined ? it.customPrice : it.item.price) * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1 pt-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${completedReceipt.subtotal.toFixed(2)}</span>
                </div>
                {completedReceipt.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-${completedReceipt.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (8.25%):</span>
                  <span>${completedReceipt.salesTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gratuity:</span>
                  <span>${completedReceipt.tipAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-neutral-300 text-neutral-900">
                  <span>TOTAL:</span>
                  <span>${completedReceipt.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Receipt Distribution Options */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  window.print();
                  showToast('Receipt sent to thermal printer', 'info');
                }}
                className="py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => showToast(`Receipt emailed to ${completedReceipt.clientEmail}`, 'success')}
                className="py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </button>
              <button
                onClick={() => showToast('Receipt sent via SMS', 'success')}
                className="py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>SMS</span>
              </button>
            </div>

            <button
              onClick={() => setCompletedReceipt(null)}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              New Transaction
            </button>
          </div>
        </div>
      )}

      {/* Shift Z-Report Modal */}
      {showZReport && (
        <div className="fixed inset-0 z-50 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-neutral-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-serif font-bold text-lg text-neutral-900">Shift Close & Z-Report</h3>
                <p className="text-xs text-neutral-500">Terminal #1 • End of Day Audit Summary</p>
              </div>
              <button onClick={() => setShowZReport(false)} className="text-neutral-400 hover:text-neutral-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block mb-1">Gross Terminal Volume</span>
                  <span className="font-serif text-xl font-bold text-neutral-900 font-mono">$4,860.00</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block mb-1">Total Transactions</span>
                  <span className="font-serif text-xl font-bold text-neutral-900 font-mono">28 Receipts</span>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <div className="flex justify-between font-medium">
                  <span className="text-neutral-600">Credit / Debit EMV:</span>
                  <span className="font-mono font-bold">$3,940.00</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-neutral-600">Cash in Drawer:</span>
                  <span className="font-mono font-bold">$580.00</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-neutral-600">Gift Card Redemptions:</span>
                  <span className="font-mono font-bold">$340.00</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-neutral-200 text-neutral-900 font-bold">
                  <span>Therapist Tips Dispersed:</span>
                  <span className="font-mono text-emerald-700">$785.00</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.print();
                  showToast('Z-Report Printed', 'info');
                }}
                className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Audit</span>
              </button>
              <button
                onClick={() => {
                  setShowZReport(false);
                  showToast('Shift closed and synced with admin database', 'success');
                }}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Confirm Shift Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
