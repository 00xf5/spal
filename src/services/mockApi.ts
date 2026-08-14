import {
  Service,
  ServiceCategory,
  StaffProfile,
  User,
  ClientProfile,
  Location,
  Booking,
  BookingStatus,
  Review,
  MembershipPlan,
  GiftCard,
  AuditLogEntry,
  AdminKPIs,
  CreateBookingDTO,
  AvailabilitySlot,
} from '../types';

const STORAGE_KEY = 'serene_spa_state_v1';

// Initial Seed Data
const SEED_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-massage',
    name: 'Restorative Massage',
    description: 'Therapeutic touch, tension relief, and deep muscular recovery.',
    iconName: 'Sparkles',
  },
  {
    id: 'cat-facial',
    name: 'Botanical Facials',
    description: 'Organic cellular renewal, hydration infusions, and radiant glow.',
    iconName: 'Flower2',
  },
  {
    id: 'cat-body',
    name: 'Body Rituals & Scrubs',
    description: 'Exfoliating salt rituals, nourishing body wraps, and thermal mud.',
    iconName: 'Sun',
  },
  {
    id: 'cat-holistic',
    name: 'Holistic & Energy',
    description: 'Tibetan sound baths, reiki balance, and lymphatic alignment.',
    iconName: 'Flame',
  },
  {
    id: 'cat-hydro',
    name: 'Hydrotherapy & Scalp',
    description: 'Mineral soaks, Japanese waterfall head spas, and botanical elixirs.',
    iconName: 'Droplets',
  },
];

const SEED_SERVICES: Service[] = [
  {
    id: 'srv-1',
    category_id: 'cat-massage',
    name: 'Signature Deep Tissue & Cedarwood Release',
    description: 'Intensive muscle release combining organic cedarwood oils, warm compresses, and targeted trigger point therapy to alleviate chronic tension and muscular fatigue.',
    duration_min: 60,
    buffer_min: 15,
    price: 165,
    active: true,
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    contraindications: ['Recent open wounds', 'Acute inflammatory conditions', 'First trimester pregnancy'],
    beforeAfterCare: {
      before: 'Hydrate well and arrive 15 minutes early to unwind in our cedar relaxation lounge.',
      after: 'Drink ample filtered herbal tea; refrain from strenuous workouts for 12 hours.',
    },
    availableStaffIds: ['staff-1', 'staff-2'],
    addons: [
      { id: 'add-1', name: 'Aromatherapy Herbal Infusion', price: 25, duration_min: 0, description: 'Wild lavender and sweet marjoram essential oil blend.' },
      { id: 'add-2', name: 'Hot Basalt Stone Placement', price: 35, duration_min: 15, description: 'Heated volcanic stones placed along the spinal meridians.' },
      { id: 'add-3', name: 'Herbal Foot Compress & Scrub', price: 30, duration_min: 15, description: 'Eucalyptus and magnesium salt foot exfoliation.' },
    ],
  },
  {
    id: 'srv-2',
    category_id: 'cat-massage',
    name: 'Himalayan Warm Salt Stone Ritual',
    description: 'Hand-carved warm Himalayan salt stones deliver 84 minerals to melt away stress, rebalance electromagnetic fields, and leave the skin silky and detoxified.',
    duration_min: 75,
    buffer_min: 15,
    price: 195,
    active: true,
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80',
    contraindications: ['Sunburn or raw skin', 'Uncontrolled hypertension'],
    beforeAfterCare: {
      before: 'Avoid heavy meals 1 hour before session.',
      after: 'Allow mineral oils to absorb overnight before showering if possible.',
    },
    availableStaffIds: ['staff-1', 'staff-4'],
    addons: [
      { id: 'add-1', name: 'Aromatherapy Herbal Infusion', price: 25, duration_min: 0, description: 'Wild lavender and sweet marjoram essential oil blend.' },
      { id: 'add-4', name: 'Collagen Eye Rejuvenation', price: 30, duration_min: 0, description: 'Cooling peptide patches to reduce puffiness.' },
    ],
  },
  {
    id: 'srv-3',
    category_id: 'cat-facial',
    name: 'Rose Quartz Botanical Glow Facial',
    description: 'Customized organic fruit enzymes, double rosehip cleansing, ultrasonic hydration mist, and sculpted rose quartz gua sha lymphatic drainage.',
    duration_min: 60,
    buffer_min: 15,
    price: 175,
    active: true,
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    contraindications: ['Active cystic breakout', 'Recent chemical peel within 7 days'],
    beforeAfterCare: {
      before: 'Discontinue retinol and exfoliating acids 48 hours prior.',
      after: 'Apply mineral SPF 50 daily; avoid makeup for the rest of the day.',
    },
    availableStaffIds: ['staff-3', 'staff-4'],
    addons: [
      { id: 'add-4', name: 'Collagen Eye Rejuvenation', price: 30, duration_min: 0, description: 'Cooling peptide patches to reduce puffiness.' },
      { id: 'add-5', name: 'LED Light Therapy Boost', price: 40, duration_min: 15, description: 'Near-infrared & red LED spectrum for collagen synthesis.' },
    ],
  },
  {
    id: 'srv-4',
    category_id: 'cat-hydro',
    name: 'Japanese Head Spa & Waterfall Scalp Therapy',
    description: 'Multi-step scalp detox utilizing micro-mist steaming, botanical tonic massage, gentle exfoliation, and a soothing warm circular rainfall shower cascade.',
    duration_min: 60,
    buffer_min: 15,
    price: 185,
    active: true,
    popular: true,
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    contraindications: ['Hair extensions / bonded weaves', 'Open scalp lesions'],
    beforeAfterCare: {
      before: 'Hair does not need to be washed before arrival.',
      after: 'Natural rough dry provided; styling bar available in locker room.',
    },
    availableStaffIds: ['staff-2', 'staff-3'],
    addons: [
      { id: 'add-6', name: 'Deep Conditioning Hair Mask', price: 35, duration_min: 15, description: 'Keratin & argan butter nutrient wrap.' },
      { id: 'add-1', name: 'Aromatherapy Herbal Infusion', price: 25, duration_min: 0, description: 'Wild lavender and sweet marjoram essential oil blend.' },
    ],
  },
  {
    id: 'srv-5',
    category_id: 'cat-body',
    name: 'Dead Sea Minerals & Eucalyptus Body Polish',
    description: 'Full body invigorating sea salt polish followed by a warm botanical rain rinse and silky shea-jojoba hydration cocoon to reveal glowing, velvety skin.',
    duration_min: 75,
    buffer_min: 15,
    price: 210,
    active: true,
    popular: false,
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    contraindications: ['Shaved within 24 hours', 'Severe eczema flare-ups'],
    beforeAfterCare: {
      before: 'Do not shave legs on the day of treatment.',
      after: 'Stay shielded from direct sun; moisturize generously.',
    },
    availableStaffIds: ['staff-1', 'staff-2', 'staff-3'],
    addons: [
      { id: 'add-2', name: 'Hot Basalt Stone Placement', price: 35, duration_min: 15, description: 'Heated volcanic stones placed along the spinal meridians.' },
    ],
  },
  {
    id: 'srv-6',
    category_id: 'cat-holistic',
    name: 'Tibetan Singing Bowl & Sound Bath Alignment',
    description: 'Harmonic acoustic resonance with authentic hand-hammered singing bowls, chakra grounding, and gentle breathwork to synchronize brainwaves into deep delta calm.',
    duration_min: 50,
    buffer_min: 10,
    price: 135,
    active: true,
    popular: false,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    contraindications: ['Pacemakers', 'Sound-induced epilepsy'],
    beforeAfterCare: {
      before: 'Wear loose, comfortable breathable clothing.',
      after: 'Enjoy 10 minutes of quiet integration with our lotus blossom tea.',
    },
    availableStaffIds: ['staff-2', 'staff-4'],
    addons: [
      { id: 'add-1', name: 'Aromatherapy Herbal Infusion', price: 25, duration_min: 0, description: 'Wild lavender and sweet marjoram essential oil blend.' },
    ],
  },
];

const SEED_STAFF: (StaffProfile & User)[] = [
  {
    id: 'staff-1',
    user_id: 'staff-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@serenespa.com',
    phone: '+1 (555) 234-8901',
    role: 'staff',
    status: 'active',
    title: 'Lead Massage Therapist & Bodywork Specialist',
    bio: 'With over 12 years of specialized training in Swedish myofascial release, Thai compression, and hot mineral stone therapy, Elena crafts deeply intuitive restorative journeys.',
    specialties: ['Deep Tissue', 'Himalayan Salt Stones', 'Trigger Point Therapy', 'Prenatal Care'],
    commission_rate: 0.40,
    rating: 4.98,
    reviewsCount: 142,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    availableDays: [1, 2, 3, 4, 5], // Mon - Fri
    workingHours: { start: '09:00', end: '18:00' },
    active: true,
  },
  {
    id: 'staff-2',
    user_id: 'staff-2',
    name: 'Marcus Chen',
    email: 'marcus.chen@serenespa.com',
    phone: '+1 (555) 345-6789',
    role: 'staff',
    status: 'active',
    title: 'Holistic Therapist & Japanese Head Spa Artisan',
    bio: 'Trained in Kyoto and Vancouver, Marcus specializes in scalp meridian stimulation, Tibetan acoustic sound baths, and holistic stress relief rituals.',
    specialties: ['Japanese Head Spa', 'Sound Healing', 'Aromatherapy', 'Body Polishes'],
    commission_rate: 0.38,
    rating: 4.95,
    reviewsCount: 98,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    availableDays: [2, 3, 4, 5, 6], // Tue - Sat
    workingHours: { start: '10:00', end: '19:00' },
    active: true,
  },
  {
    id: 'staff-3',
    user_id: 'staff-3',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@serenespa.com',
    phone: '+1 (555) 456-7890',
    role: 'staff',
    status: 'active',
    title: 'Master Aesthetician & Skin Alchemist',
    bio: 'Certified Parisian aesthetician with a focus on non-invasive botanical rejuvenation, rose quartz sculpting, and customized cellular hydration therapies.',
    specialties: ['Rose Quartz Facials', 'Gua Sha Sculpting', 'Enzyme Peels', 'LED Therapy'],
    commission_rate: 0.42,
    rating: 4.99,
    reviewsCount: 164,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    availableDays: [1, 3, 4, 5, 6], // Mon, Wed - Sat
    workingHours: { start: '09:30', end: '18:30' },
    active: true,
  },
  {
    id: 'staff-4',
    user_id: 'staff-4',
    name: 'Dr. Julian Vance',
    email: 'julian.vance@serenespa.com',
    phone: '+1 (555) 567-8901',
    role: 'staff',
    status: 'active',
    title: 'Naturopathic Practitioner & Wellness Guide',
    bio: 'Blends functional physiotherapy with ancient energetic therapies, herbal medicine consultations, and therapeutic mineral balneology.',
    specialties: ['Himalayan Salt Stones', 'Botanical Facials', 'Acupressure', 'Sound Baths'],
    commission_rate: 0.45,
    rating: 4.92,
    reviewsCount: 81,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    availableDays: [0, 1, 2, 5, 6], // Sun, Mon, Tue, Fri, Sat
    workingHours: { start: '10:00', end: '18:00' },
    active: true,
  },
];

const SEED_LOCATIONS: Location[] = [
  {
    id: 'loc-1',
    name: 'Serene Sanctuary — Downtown Flagship',
    address: '428 Botanical Way, Grand Atrium Suite 300',
    city: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    business_hours: {
      open: '08:30',
      close: '20:00',
      days: 'Monday – Sunday',
    },
    phone: '+1 (415) 890-2100',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  },
];

const SEED_CLIENTS: (User & { profile: ClientProfile })[] = [
  {
    id: 'client-1',
    email: 'sarah.jenkins@example.com',
    name: 'Sarah Jenkins',
    phone: '+1 (555) 912-4433',
    role: 'client',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    profile: {
      user_id: 'client-1',
      preferences: ['Warm room temperature (74°F)', 'Cedar & lavender scent', 'Firm pressure on lower back'],
      emergency_contact: {
        name: 'David Jenkins',
        phone: '+1 (555) 912-4434',
        relationship: 'Spouse',
      },
      allergies: ['Eucalyptus oil sensitive', 'Tree nut oils (use jojoba/sunflower only)'],
      medicalNotes: 'Mild lumbar tightness from marathon training. Please avoid high neck rotational stretching.',
      totalSpend: 1480,
      visitCount: 7,
      memberTier: 'Gold Ritualist',
      creditsRemaining: 2,
    },
  },
  {
    id: 'client-2',
    email: 'liam.oconnor@example.com',
    name: 'Liam O’Connor',
    phone: '+1 (555) 843-1122',
    role: 'client',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    profile: {
      user_id: 'client-2',
      preferences: ['Quiet session (minimal talking)', 'Medium pressure'],
      emergency_contact: {
        name: 'Clara O’Connor',
        phone: '+1 (555) 843-1125',
        relationship: 'Sister',
      },
      allergies: ['None declared'],
      medicalNotes: 'Frequent migraines from screen time; enjoys extra scalp and temple focus.',
      totalSpend: 620,
      visitCount: 3,
      memberTier: 'Silver Sanctuary',
      creditsRemaining: 1,
    },
  },
  {
    id: 'client-3',
    email: 'maya.patel@example.com',
    name: 'Maya Patel',
    phone: '+1 (555) 762-9844',
    role: 'client',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    profile: {
      user_id: 'client-3',
      preferences: ['Citrus aromatherapy', 'Extra heated blanket'],
      emergency_contact: {
        name: 'Rohan Patel',
        phone: '+1 (555) 762-9840',
        relationship: 'Partner',
      },
      allergies: ['Sensitive to synthetic fragrances'],
      medicalNotes: 'Recovering from right shoulder strain.',
      totalSpend: 2150,
      visitCount: 11,
      memberTier: 'Platinum Wellness',
      creditsRemaining: 4,
    },
  },
];

// Helper for dates relative to today
const getRelativeDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const SEED_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    bookingRef: 'SRN-84920',
    client_id: 'client-1',
    client_name: 'Sarah Jenkins',
    client_email: 'sarah.jenkins@example.com',
    client_phone: '+1 (555) 912-4433',
    staff_id: 'staff-1',
    staff_name: 'Elena Rostova',
    service_id: 'srv-1',
    service_name: 'Signature Deep Tissue & Cedarwood Release',
    location_id: 'loc-1',
    location_name: 'Downtown Flagship',
    date: getRelativeDate(2), // 2 days from now
    startTime: '11:00',
    endTime: '12:15',
    duration_min: 75,
    status: 'confirmed',
    price_paid: 190,
    selectedAddons: [
      { id: 'add-1', name: 'Aromatherapy Herbal Infusion', price: 25, duration_min: 0, description: 'Wild lavender and sweet marjoram.' },
    ],
    clientNotes: 'Focus on shoulder blades and right hamstring please.',
    allergies: ['Eucalyptus oil sensitive', 'Tree nut oils'],
    treatmentNotes: 'Prior visit showed notable thoracic release with slow friction strokes. Used warm jojoba oil base.',
    paymentStatus: 'paid',
    createdAt: '2026-08-10T14:20:00Z',
    canCancelFreeUntil: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 'bk-102',
    bookingRef: 'SRN-77312',
    client_id: 'client-1',
    client_name: 'Sarah Jenkins',
    client_email: 'sarah.jenkins@example.com',
    client_phone: '+1 (555) 912-4433',
    staff_id: 'staff-3',
    staff_name: 'Sophie Laurent',
    service_id: 'srv-3',
    service_name: 'Rose Quartz Botanical Glow Facial',
    location_id: 'loc-1',
    location_name: 'Downtown Flagship',
    date: getRelativeDate(9),
    startTime: '14:30',
    endTime: '15:30',
    duration_min: 60,
    status: 'confirmed',
    price_paid: 175,
    selectedAddons: [],
    clientNotes: 'Gentle hydration, no chemical exfoliants.',
    allergies: ['Tree nut oils'],
    paymentStatus: 'paid',
    createdAt: '2026-08-12T09:15:00Z',
    canCancelFreeUntil: new Date(Date.now() + 86400000 * 8).toISOString(),
  },
  {
    id: 'bk-103',
    bookingRef: 'SRN-55198',
    client_id: 'client-1',
    client_name: 'Sarah Jenkins',
    client_email: 'sarah.jenkins@example.com',
    client_phone: '+1 (555) 912-4433',
    staff_id: 'staff-1',
    staff_name: 'Elena Rostova',
    service_id: 'srv-2',
    service_name: 'Himalayan Warm Salt Stone Ritual',
    location_id: 'loc-1',
    location_name: 'Downtown Flagship',
    date: getRelativeDate(-14), // past
    startTime: '10:00',
    endTime: '11:15',
    duration_min: 75,
    status: 'completed',
    price_paid: 225,
    selectedAddons: [
      { id: 'add-4', name: 'Collagen Eye Rejuvenation', price: 30, duration_min: 0, description: 'Cooling peptide patches' },
    ],
    treatmentNotes: 'Excellent session. Client responded warmly to Himalayan salt stones on lower spinal muscles. Skin hydrated with botanical rosehip and jojoba.',
    allergies: ['Eucalyptus oil sensitive'],
    paymentStatus: 'paid',
    createdAt: '2026-07-28T10:00:00Z',
    canCancelFreeUntil: '2026-07-31T10:00:00Z',
  },
  {
    id: 'bk-104',
    bookingRef: 'SRN-99431',
    client_id: 'client-2',
    client_name: 'Liam O’Connor',
    client_email: 'liam.oconnor@example.com',
    client_phone: '+1 (555) 843-1122',
    staff_id: 'staff-2',
    staff_name: 'Marcus Chen',
    service_id: 'srv-4',
    service_name: 'Japanese Head Spa & Waterfall Scalp Therapy',
    location_id: 'loc-1',
    location_name: 'Downtown Flagship',
    date: getRelativeDate(0), // TODAY!
    startTime: '13:00',
    endTime: '14:15',
    duration_min: 75,
    status: 'confirmed',
    price_paid: 220,
    selectedAddons: [
      { id: 'add-6', name: 'Deep Conditioning Hair Mask', price: 35, duration_min: 15, description: 'Keratin & argan butter' },
    ],
    clientNotes: 'Suffering from tension headaches this week.',
    allergies: [],
    treatmentNotes: 'Prepared peppermint and rosemary scalp tonic. Verified water pressure preference.',
    paymentStatus: 'paid',
    createdAt: '2026-08-11T16:00:00Z',
    canCancelFreeUntil: new Date().toISOString(),
  },
  {
    id: 'bk-105',
    bookingRef: 'SRN-63201',
    client_id: 'client-3',
    client_name: 'Maya Patel',
    client_email: 'maya.patel@example.com',
    client_phone: '+1 (555) 762-9844',
    staff_id: 'staff-1',
    staff_name: 'Elena Rostova',
    service_id: 'srv-1',
    service_name: 'Signature Deep Tissue & Cedarwood Release',
    location_id: 'loc-1',
    location_name: 'Downtown Flagship',
    date: getRelativeDate(0), // TODAY!
    startTime: '15:30',
    endTime: '16:30',
    duration_min: 60,
    status: 'confirmed',
    price_paid: 165,
    selectedAddons: [],
    clientNotes: 'Right shoulder gentle range of motion.',
    allergies: ['Sensitive to synthetic fragrances'],
    paymentStatus: 'paid',
    createdAt: '2026-08-13T11:45:00Z',
    canCancelFreeUntil: new Date().toISOString(),
  },
  {
    id: 'bk-106',
    bookingRef: 'SRN-31298',
    client_id: 'client-2',
    client_name: 'Liam O’Connor',
    client_email: 'liam.oconnor@example.com',
    client_phone: '+1 (555) 843-1122',
    staff_id: 'staff-4',
    staff_name: 'Dr. Julian Vance',
    service_id: 'srv-6',
    service_name: 'Tibetan Singing Bowl & Sound Bath Alignment',
    location_id: 'loc-1',
    location_name: 'Downtown Flagship',
    date: getRelativeDate(-25),
    startTime: '16:00',
    endTime: '16:50',
    duration_min: 50,
    status: 'completed',
    price_paid: 135,
    selectedAddons: [],
    paymentStatus: 'paid',
    createdAt: '2026-07-15T08:00:00Z',
    canCancelFreeUntil: '2026-07-18T08:00:00Z',
  },
];

const SEED_MEMBERSHIPS: MembershipPlan[] = [
  {
    id: 'mem-1',
    name: 'Sanctuary Silver',
    price: 140,
    period: 'month',
    credits: 1,
    description: 'One 60-minute massage or botanical facial per month, plus member perks.',
    perks: ['1 free session / month', '15% off all additional treatments', 'Complimentary hydrotherapy access', 'Free cancellation up to 12h'],
  },
  {
    id: 'mem-2',
    name: 'Gold Ritualist',
    price: 260,
    period: 'month',
    credits: 2,
    popular: true,
    description: 'Two full treatments per month with priority weekend bookings and guest pass.',
    perks: ['2 full sessions / month', '20% off all additional treatments & retail', '1 guest pass per quarter', 'Exclusive seasonal aromatherapy upgrades'],
  },
  {
    id: 'mem-3',
    name: 'Platinum Wellness Immersion',
    price: 480,
    period: 'month',
    credits: 4,
    description: 'Four transformative sessions per month, bespoke wellness curation, and full bathhouse privileges.',
    perks: ['4 full sessions / month', '25% off all retail & upgrades', 'Unlimited thermal lounge & hydrotherapy', 'Complimentary bespoke tea blends'],
  },
];

const SEED_GIFTCARDS: GiftCard[] = [
  {
    id: 'gc-1',
    code: 'SERENE-GLOW-2026',
    initial_balance: 200,
    current_balance: 200,
    issued_to: 'Sarah Jenkins',
    issued_by: 'Michael Jenkins',
    message: 'Wishing you a blissful day of renewal and peace! Happy Anniversary.',
    expires_at: '2027-12-31',
    status: 'active',
  },
  {
    id: 'gc-2',
    code: 'RELAX-SPA-50',
    initial_balance: 100,
    current_balance: 50,
    issued_to: 'Liam O’Connor',
    issued_by: 'Serene Loyalty Program',
    expires_at: '2027-06-30',
    status: 'active',
  },
];

const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    booking_id: 'bk-103',
    service_id: 'srv-2',
    service_name: 'Himalayan Warm Salt Stone Ritual',
    staff_id: 'staff-1',
    staff_name: 'Elena Rostova',
    client_name: 'Sarah J.',
    rating: 5,
    comment: 'Elena is exceptional. The warm salt stones completely dissolved my lower back tension. The atmosphere with cedarwood oils and soft lighting is pure tranquility.',
    date: '2026-08-01',
    status: 'published',
  },
  {
    id: 'rev-2',
    booking_id: 'bk-106',
    service_id: 'srv-6',
    service_name: 'Tibetan Singing Bowl & Sound Bath Alignment',
    staff_id: 'staff-4',
    staff_name: 'Dr. Julian Vance',
    client_name: 'Liam O.',
    rating: 5,
    comment: 'I felt lighter than I have in months. Dr. Julian creates a sacred, deeply grounding acoustic experience. Highly recommended for busy minds.',
    date: '2026-07-21',
    status: 'published',
  },
  {
    id: 'rev-3',
    booking_id: 'bk-999',
    service_id: 'srv-3',
    service_name: 'Rose Quartz Botanical Glow Facial',
    staff_id: 'staff-3',
    staff_name: 'Sophie Laurent',
    client_name: 'Maya P.',
    rating: 5,
    comment: 'Sophie’s gua sha technique lifted and rejuvenated my face instantly. My skin remained glowing for days after.',
    date: '2026-08-05',
    status: 'published',
  },
];

const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    actor_name: 'System / Guest Checkout',
    actor_role: 'system',
    action: 'CREATE_BOOKING',
    entity: 'Booking',
    entity_id: 'SRN-84920',
    details: 'Booking confirmed for Sarah Jenkins with Elena Rostova on ' + getRelativeDate(2) + ' at 11:00',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'log-2',
    actor_name: 'Elena Rostova',
    actor_role: 'staff',
    action: 'UPDATE_TREATMENT_NOTES',
    entity: 'Booking',
    entity_id: 'SRN-55198',
    details: 'Logged treatment notes and marked session completed.',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

interface SpaState {
  categories: ServiceCategory[];
  services: Service[];
  staff: (StaffProfile & User)[];
  locations: Location[];
  clients: (User & { profile: ClientProfile })[];
  bookings: Booking[];
  memberships: MembershipPlan[];
  giftCards: GiftCard[];
  reviews: Review[];
  auditLogs: AuditLogEntry[];
}

function loadState(): SpaState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.services && parsed.bookings && parsed.staff) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error parsing local spa state, using seed:', e);
  }
  const initialState: SpaState = {
    categories: SEED_CATEGORIES,
    services: SEED_SERVICES,
    staff: SEED_STAFF,
    locations: SEED_LOCATIONS,
    clients: SEED_CLIENTS,
    bookings: SEED_BOOKINGS,
    memberships: SEED_MEMBERSHIPS,
    giftCards: SEED_GIFTCARDS,
    reviews: SEED_REVIEWS,
    auditLogs: SEED_AUDIT_LOGS,
  };
  saveState(initialState);
  return initialState;
}

function saveState(state: SpaState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save spa state to localStorage', e);
  }
}

// In-memory reference that mirrors localStorage
let state: SpaState = loadState();

// Utility for synthetic latency (simulates realistic clean API response)
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// §8 API Endpoint Surface Implementation
// ==========================================

export const mockApi = {
  // Services
  async getCategories(): Promise<ServiceCategory[]> {
    await delay();
    return [...state.categories];
  },

  async getServices(categoryId?: string): Promise<Service[]> {
    await delay();
    if (categoryId && categoryId !== 'all') {
      return state.services.filter((s) => s.category_id === categoryId && s.active);
    }
    return state.services.filter((s) => s.active);
  },

  async getAllServicesAdmin(): Promise<Service[]> {
    await delay();
    return [...state.services];
  },

  async getServiceById(id: string): Promise<Service | null> {
    await delay();
    return state.services.find((s) => s.id === id) || null;
  },

  async createService(newService: Omit<Service, 'id'>): Promise<Service> {
    await delay();
    const created: Service = {
      ...newService,
      id: `srv-${Date.now()}`,
    };
    state.services.push(created);
    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actor_name: 'Admin',
      actor_role: 'admin',
      action: 'CREATE_SERVICE',
      entity: 'Service',
      entity_id: created.id,
      details: `Created new service: "${created.name}" ($${created.price})`,
      timestamp: new Date().toISOString(),
    });
    saveState(state);
    return created;
  },

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    await delay();
    const idx = state.services.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Service not found');
    state.services[idx] = { ...state.services[idx], ...updates };
    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actor_name: 'Admin',
      actor_role: 'admin',
      action: 'UPDATE_SERVICE',
      entity: 'Service',
      entity_id: id,
      details: `Updated service parameters for: "${state.services[idx].name}"`,
      timestamp: new Date().toISOString(),
    });
    saveState(state);
    return state.services[idx];
  },

  async deleteService(id: string): Promise<boolean> {
    await delay();
    const srv = state.services.find((s) => s.id === id);
    state.services = state.services.filter((s) => s.id !== id);
    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actor_name: 'Admin',
      actor_role: 'admin',
      action: 'DELETE_SERVICE',
      entity: 'Service',
      entity_id: id,
      details: `Deleted service "${srv?.name || id}"`,
      timestamp: new Date().toISOString(),
    });
    saveState(state);
    return true;
  },

  // Staff
  async getStaff(serviceId?: string): Promise<(StaffProfile & User)[]> {
    await delay();
    if (serviceId) {
      const service = state.services.find((s) => s.id === serviceId);
      if (service && service.availableStaffIds?.length > 0) {
        return state.staff.filter((st) => service.availableStaffIds.includes(st.id) && st.active);
      }
    }
    return state.staff.filter((st) => st.active);
  },

  async getAllStaffAdmin(): Promise<(StaffProfile & User)[]> {
    await delay();
    return [...state.staff];
  },

  async getStaffById(id: string): Promise<(StaffProfile & User) | null> {
    await delay();
    return state.staff.find((st) => st.id === id) || null;
  },

  async createStaff(newStaff: Omit<StaffProfile & User, 'id' | 'user_id'>): Promise<StaffProfile & User> {
    await delay();
    const id = `staff-${Date.now()}`;
    const created: StaffProfile & User = {
      ...newStaff,
      id,
      user_id: id,
    };
    state.staff.push(created);
    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actor_name: 'Admin',
      actor_role: 'admin',
      action: 'CREATE_STAFF',
      entity: 'Staff',
      entity_id: created.id,
      details: `Added new therapist: ${created.name} (${created.title})`,
      timestamp: new Date().toISOString(),
    });
    saveState(state);
    return created;
  },

  async updateStaff(id: string, updates: Partial<StaffProfile & User>): Promise<StaffProfile & User> {
    await delay();
    const idx = state.staff.findIndex((st) => st.id === id);
    if (idx === -1) throw new Error('Staff member not found');
    state.staff[idx] = { ...state.staff[idx], ...updates };
    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actor_name: 'Admin',
      actor_role: 'admin',
      action: 'UPDATE_STAFF',
      entity: 'Staff',
      entity_id: id,
      details: `Updated staff profile for: ${state.staff[idx].name}`,
      timestamp: new Date().toISOString(),
    });
    saveState(state);
    return state.staff[idx];
  },

  async deleteStaff(id: string): Promise<boolean> {
    await delay();
    const st = state.staff.find((s) => s.id === id);
    state.staff = state.staff.filter((s) => s.id !== id);
    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actor_name: 'Admin',
      actor_role: 'admin',
      action: 'DELETE_STAFF',
      entity: 'Staff',
      entity_id: id,
      details: `Removed staff member: ${st?.name || id}`,
      timestamp: new Date().toISOString(),
    });
    saveState(state);
    return true;
  },

  // Locations
  async getLocations(): Promise<Location[]> {
    await delay();
    return [...state.locations];
  },

  // Availability Search (§8 availability/search)
  async searchAvailability(params: {
    serviceId: string;
    locationId?: string;
    staffId?: string; // 'any' or specific staff id
    date: string; // 'YYYY-MM-DD'
  }): Promise<AvailabilitySlot[]> {
    await delay(180);
    const { serviceId, staffId, date } = params;
    const service = state.services.find((s) => s.id === serviceId);
    if (!service) return [];

    // Target staff members
    let candidateStaff = state.staff.filter((st) => st.active);
    if (service.availableStaffIds && service.availableStaffIds.length > 0) {
      candidateStaff = candidateStaff.filter((st) => service.availableStaffIds.includes(st.id));
    }
    if (staffId && staffId !== 'any') {
      candidateStaff = candidateStaff.filter((st) => st.id === staffId);
    }

    if (candidateStaff.length === 0) return [];

    // Selected day of week (0 = Sun, 1 = Mon...)
    const dateObj = new Date(date + 'T00:00:00');
    const dayOfWeek = dateObj.getDay();

    // Time slots from 09:00 to 18:00 every 30 or 60 mins
    const standardHours = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    // Existing active bookings on that date
    const dayBookings = state.bookings.filter(
      (b) => b.date === date && b.status !== 'cancelled'
    );

    const slots: AvailabilitySlot[] = [];

    standardHours.forEach((time) => {
      // Find which staff are available at this time
      for (const st of candidateStaff) {
        if (!st.availableDays.includes(dayOfWeek)) {
          continue; // Therapist does not work on this day of week
        }

        // Check if therapist already has a booking at this time
        const isBooked = dayBookings.some((b) => {
          if (b.staff_id !== st.id) return false;
          // Simple time overlap check
          return b.startTime === time;
        });

        if (!isBooked) {
          slots.push({
            time,
            date,
            staff_id: st.id,
            staff_name: st.name,
            available: true,
          });
          // If search was for 'any', we can break after finding one capable therapist for this time slot
          if (!staffId || staffId === 'any') {
            break;
          }
        }
      }
    });

    return slots;
  },

  // Bookings (§8 bookings/*)
  async getBookings(filter?: {
    clientId?: string;
    staffId?: string;
    status?: BookingStatus;
    date?: string;
  }): Promise<Booking[]> {
    await delay();
    let res = [...state.bookings];
    if (filter?.clientId) {
      res = res.filter((b) => b.client_id === filter.clientId);
    }
    if (filter?.staffId) {
      res = res.filter((b) => b.staff_id === filter.staffId);
    }
    if (filter?.status) {
      res = res.filter((b) => b.status === filter.status);
    }
    if (filter?.date) {
      res = res.filter((b) => b.date === filter.date);
    }
    // Sort by date and startTime descending
    return res.sort((a, b) => (a.date + a.startTime > b.date + b.startTime ? 1 : -1));
  },

  async getBookingById(id: string): Promise<Booking | null> {
    await delay();
    return state.bookings.find((b) => b.id === id || b.bookingRef === id) || null;
  },

  async createBooking(dto: CreateBookingDTO): Promise<Booking> {
    await delay(300);
    const service = state.services.find((s) => s.id === dto.serviceId);
    if (!service) throw new Error('Service not found');

    let staff = state.staff.find((st) => st.id === dto.staffId);
    if (!staff || dto.staffId === 'any') {
      // Assign first available qualified therapist
      const candidates = state.staff.filter((st) => st.active && service.availableStaffIds.includes(st.id));
      staff = candidates[0] || state.staff[0];
    }

    const location = state.locations.find((l) => l.id === dto.locationId) || state.locations[0];

    // Calculate total duration and price
    const addonDuration = dto.addons?.reduce((sum, a) => sum + (a.duration_min || 0), 0) || 0;
    const addonPrice = dto.addons?.reduce((sum, a) => sum + a.price, 0) || 0;
    const totalDuration = service.duration_min + addonDuration;
    const totalPrice = service.price + addonPrice;

    // Calculate end time
    const [startH, startM] = dto.startTime.split(':').map(Number);
    const endMinutesTotal = startH * 60 + startM + totalDuration;
    const endH = Math.floor(endMinutesTotal / 60);
    const endM = endMinutesTotal % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const refNumber = Math.floor(10000 + Math.random() * 90000);
    const bookingRef = `SRN-${refNumber}`;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingRef,
      client_id: dto.client.id || 'client-1', // Link to current active client
      client_name: dto.client.name,
      client_email: dto.client.email,
      client_phone: dto.client.phone,
      staff_id: staff.id,
      staff_name: staff.name,
      service_id: service.id,
      service_name: service.name,
      location_id: location.id,
      location_name: location.name,
      date: dto.date,
      startTime: dto.startTime,
      endTime,
      duration_min: totalDuration,
      status: 'confirmed',
      price_paid: totalPrice,
      selectedAddons: dto.addons || [],
      clientNotes: dto.client.notes || '',
      allergies: dto.client.allergies || [],
      treatmentNotes: '',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
      canCancelFreeUntil: new Date(new Date(dto.date + 'T' + dto.startTime).getTime() - 86400000).toISOString(),
    };

    // Prepend to bookings array
    state.bookings.unshift(newBooking);

    // Update client spend & visits if matched
    const clientIdx = state.clients.findIndex((c) => c.email.toLowerCase() === dto.client.email.toLowerCase() || c.id === dto.client.id);
    if (clientIdx !== -1) {
      state.clients[clientIdx].profile.totalSpend += totalPrice;
      state.clients[clientIdx].profile.visitCount += 1;
    }

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actor_name: dto.client.name,
      actor_role: 'client',
      action: 'CREATE_BOOKING',
      entity: 'Booking',
      entity_id: bookingRef,
      details: `Created booking ${bookingRef} for ${service.name} with ${staff.name} on ${dto.date} at ${dto.startTime}`,
      timestamp: new Date().toISOString(),
    });

    saveState(state);
    return newBooking;
  },

  async rescheduleBooking(id: string, newDate: string, newStartTime: string): Promise<Booking> {
    await delay(250);
    const idx = state.bookings.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Booking not found');

    const booking = state.bookings[idx];
    const [startH, startM] = newStartTime.split(':').map(Number);
    const endMinutesTotal = startH * 60 + startM + booking.duration_min;
    const endH = Math.floor(endMinutesTotal / 60);
    const endM = endMinutesTotal % 60;
    const newEndTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const oldDate = booking.date;
    const oldTime = booking.startTime;

    state.bookings[idx] = {
      ...booking,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      status: 'confirmed',
      canCancelFreeUntil: new Date(new Date(newDate + 'T' + newStartTime).getTime() - 86400000).toISOString(),
    };

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actor_name: booking.client_name,
      actor_role: 'client',
      action: 'RESCHEDULE_BOOKING',
      entity: 'Booking',
      entity_id: booking.bookingRef,
      details: `Rescheduled ${booking.bookingRef} from ${oldDate} ${oldTime} to ${newDate} ${newStartTime}`,
      timestamp: new Date().toISOString(),
    });

    saveState(state);
    return state.bookings[idx];
  },

  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    await delay(200);
    const idx = state.bookings.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Booking not found');

    const booking = state.bookings[idx];
    state.bookings[idx] = {
      ...booking,
      status: 'cancelled',
      paymentStatus: 'refunded',
    };

    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actor_name: booking.client_name,
      actor_role: 'client',
      action: 'CANCEL_BOOKING',
      entity: 'Booking',
      entity_id: booking.bookingRef,
      details: `Cancelled booking ${booking.bookingRef}. Slot released. Reason: ${reason || 'Client request'}`,
      timestamp: new Date().toISOString(),
    });

    saveState(state);
    return state.bookings[idx];
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    await delay();
    const idx = state.bookings.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    state.bookings[idx] = {
      ...state.bookings[idx],
      status,
    };
    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actor_name: 'Staff / Admin',
      actor_role: 'staff',
      action: 'UPDATE_STATUS',
      entity: 'Booking',
      entity_id: state.bookings[idx].bookingRef,
      details: `Status changed to "${status}" for booking ${state.bookings[idx].bookingRef}`,
      timestamp: new Date().toISOString(),
    });
    saveState(state);
    return state.bookings[idx];
  },

  async addTreatmentNotes(id: string, notes: string): Promise<Booking> {
    await delay();
    const idx = state.bookings.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    state.bookings[idx] = {
      ...state.bookings[idx],
      treatmentNotes: notes,
    };
    state.auditLogs.unshift({
      id: `log-${Date.now()}`,
      actor_name: state.bookings[idx].staff_name,
      actor_role: 'staff',
      action: 'ADD_TREATMENT_NOTES',
      entity: 'Booking',
      entity_id: state.bookings[idx].bookingRef,
      details: `Logged confidential treatment & contraindication notes for ${state.bookings[idx].client_name}`,
      timestamp: new Date().toISOString(),
    });
    saveState(state);
    return state.bookings[idx];
  },

  // Clients
  async getClients(): Promise<(User & { profile: ClientProfile })[]> {
    await delay();
    return [...state.clients];
  },

  async getClientById(id: string): Promise<(User & { profile: ClientProfile }) | null> {
    await delay();
    return state.clients.find((c) => c.id === id) || null;
  },

  async updateClientProfile(id: string, profileUpdates: Partial<ClientProfile>, userUpdates?: Partial<User>): Promise<User & { profile: ClientProfile }> {
    await delay();
    const idx = state.clients.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Client not found');
    state.clients[idx] = {
      ...state.clients[idx],
      ...(userUpdates || {}),
      profile: {
        ...state.clients[idx].profile,
        ...profileUpdates,
      },
    };
    saveState(state);
    return state.clients[idx];
  },

  // Memberships & Gift Cards
  async getMemberships(): Promise<MembershipPlan[]> {
    await delay();
    return [...state.memberships];
  },

  async getGiftCards(): Promise<GiftCard[]> {
    await delay();
    return [...state.giftCards];
  },

  async validatePromoOrGiftCard(code: string): Promise<{ valid: boolean; discount: number; type: string }> {
    await delay(150);
    const upper = code.trim().toUpperCase();
    if (upper === 'SERENE10') {
      return { valid: true, discount: 10, type: 'percent' };
    }
    if (upper === 'WELLNESS25') {
      return { valid: true, discount: 25, type: 'fixed' };
    }
    const gc = state.giftCards.find((g) => g.code.toUpperCase() === upper && g.status === 'active');
    if (gc) {
      return { valid: true, discount: gc.current_balance, type: 'gift_card' };
    }
    return { valid: false, discount: 0, type: 'none' };
  },

  // Reviews
  async getReviews(serviceId?: string): Promise<Review[]> {
    await delay();
    if (serviceId) {
      return state.reviews.filter((r) => r.service_id === serviceId && r.status === 'published');
    }
    return state.reviews.filter((r) => r.status === 'published');
  },

  async getAllReviewsAdmin(): Promise<Review[]> {
    await delay();
    return [...state.reviews];
  },

  async addReview(review: Omit<Review, 'id' | 'status' | 'date'>): Promise<Review> {
    await delay();
    const created: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      status: 'published',
      date: new Date().toISOString().split('T')[0],
    };
    state.reviews.unshift(created);
    saveState(state);
    return created;
  },

  // Admin KPIs & Audit Log
  async getAdminKPIs(): Promise<AdminKPIs> {
    await delay();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayBookings = state.bookings.filter((b) => b.date === todayStr && b.status !== 'cancelled');
    const todayRevenue = todayBookings.reduce((sum, b) => sum + b.price_paid, 0);

    const activeStaff = state.staff.filter((s) => s.active);
    const activeServices = state.services.filter((s) => s.active);

    const totalCompleted = state.bookings.filter((b) => b.status === 'completed').length;
    const totalNoShows = state.bookings.filter((b) => b.status === 'no_show').length;
    const noShowRate = totalCompleted + totalNoShows > 0 ? Number(((totalNoShows / (totalCompleted + totalNoShows)) * 100).toFixed(1)) : 1.8;

    return {
      todayBookingsCount: todayBookings.length,
      todayRevenue,
      occupancyRate: 86,
      noShowRate,
      totalClients: state.clients.length,
      activeServicesCount: activeServices.length,
      activeStaffCount: activeStaff.length,
    };
  },

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    await delay();
    return [...state.auditLogs];
  },

  // Reset to original seeds
  async resetMockData(): Promise<void> {
    await delay();
    localStorage.removeItem(STORAGE_KEY);
    state = loadState();
  },
};
