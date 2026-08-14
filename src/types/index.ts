export type UserRole = 'guest' | 'client' | 'staff' | 'front_desk' | 'manager' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'inactive';
  avatarUrl?: string;
}

export interface ClientProfile {
  user_id: string;
  preferences: string[];
  emergency_contact: {
    name: string;
    phone: string;
    relationship: string;
  };
  allergies: string[];
  medicalNotes: string;
  totalSpend: number;
  visitCount: number;
  memberTier?: 'Standard' | 'Silver Sanctuary' | 'Gold Ritualist' | 'Platinum Wellness';
  creditsRemaining: number;
}

export interface StaffProfile {
  user_id: string;
  bio: string;
  title: string;
  specialties: string[];
  commission_rate: number; // e.g. 0.35 = 35%
  rating: number;
  reviewsCount: number;
  avatarUrl: string;
  availableDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  workingHours: { start: string; end: string }; // e.g. "09:00", "18:00"
  active: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  timezone: string;
  business_hours: {
    open: string;
    close: string;
    days: string;
  };
  phone: string;
  imageUrl: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface ServiceAddon {
  id: string;
  name: string;
  price: number;
  duration_min: number;
  description: string;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string;
  duration_min: number;
  buffer_min: number;
  price: number;
  active: boolean;
  imageUrl: string;
  contraindications: string[];
  beforeAfterCare: {
    before: string;
    after: string;
  };
  popular?: boolean;
  availableStaffIds: string[];
  addons: ServiceAddon[];
}

export interface StaffService {
  staff_id: string;
  service_id: string;
  location_id: string;
}

export interface AvailabilitySlot {
  time: string; // "10:00"
  date: string; // "2026-08-15"
  staff_id: string;
  staff_name: string;
  available: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Booking {
  id: string;
  bookingRef: string;
  client_id?: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  staff_id: string;
  staff_name: string;
  service_id: string;
  service_name: string;
  location_id: string;
  location_name: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "14:00"
  endTime: string; // "15:00"
  duration_min: number;
  status: BookingStatus;
  price_paid: number;
  selectedAddons: ServiceAddon[];
  clientNotes?: string;
  allergies?: string[];
  treatmentNotes?: string;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  createdAt: string;
  canCancelFreeUntil: string; // ISO string
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  method: 'card' | 'membership_credit' | 'gift_card' | 'cash';
  gateway_ref: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  credits: number;
  description: string;
  perks: string[];
  popular?: boolean;
}

export interface GiftCard {
  id: string;
  code: string;
  initial_balance: number;
  current_balance: number;
  issued_to: string;
  issued_by: string;
  message?: string;
  expires_at: string;
  status: 'active' | 'redeemed' | 'expired';
}

export interface Review {
  id: string;
  booking_id: string;
  service_id: string;
  service_name: string;
  staff_id: string;
  staff_name: string;
  client_name: string;
  rating: number;
  comment: string;
  date: string;
  status: 'published' | 'pending' | 'rejected';
}

export interface AuditLogEntry {
  id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  entity: string;
  entity_id: string;
  details: string;
  timestamp: string;
}

export interface AdminKPIs {
  todayBookingsCount: number;
  todayRevenue: number;
  occupancyRate: number; // percentage, e.g. 84
  noShowRate: number; // percentage, e.g. 2.1
  totalClients: number;
  activeServicesCount: number;
  activeStaffCount: number;
}

export interface CreateBookingDTO {
  serviceId: string;
  staffId: string;
  locationId: string;
  date: string;
  startTime: string;
  addons?: ServiceAddon[];
  client: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    notes?: string;
    allergies?: string[];
  };
  payment: {
    method: 'card' | 'membership_credit' | 'gift_card';
    cardLast4?: string;
  };
}
