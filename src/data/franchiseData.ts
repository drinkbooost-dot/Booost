import { BranchLocation } from '../types';

export const OFFICIAL_BRANCHES: BranchLocation[] = [
  {
    id: 'sm-dasmarinas',
    name: 'Booost - SM City Dasmariñas',
    mall: 'SM City Dasmariñas',
    city: 'Dasmariñas',
    province: 'Cavite',
    hours: '10:00 AM - 9:00 PM Daily',
    phone: '+63 917 890 2667',
    status: 'Open Now',
    isFlagship: true
  },
  {
    id: 'sm-trece',
    name: 'Booost - SM City Trece',
    mall: 'SM City Trece',
    city: 'Trece Martires',
    province: 'Cavite',
    hours: '10:00 AM - 9:00 PM Daily',
    phone: '+63 917 890 2668',
    status: 'Open Now'
  }
];

export interface FranchisePackage {
  id: string;
  name: string;
  type: string;
  idealSpace: string;
  investmentRange: string;
  estimatedRoiMonths: string;
  features: string[];
  recommendedFor: string;
  popular?: boolean;
}

export const FRANCHISE_PACKAGES: FranchisePackage[] = [
  {
    id: 'gym-inline',
    name: 'Gym & Fitness Counter',
    type: 'Compact Express Kiosk',
    idealSpace: '4 - 8 sqm',
    investmentRange: '₱290,000 - ₱350,000',
    estimatedRoiMonths: '7 - 11 Months',
    features: [
      'Engineered for Gold’s Gym, Anytime Fitness, and Sports Centers',
      '2x High-Torque Sound-Enclosed Commercial Blenders',
      'Compact Undercounter Blast Chiller & Ice Well',
      'Direct Gym Member Loyalty & Shake Card Integration',
      'Initial 500-Cup Premium Whey & Plant Isolate Stock',
      'Barista & Fast-Prep Workflow Training'
    ],
    recommendedFor: 'Fitness gym owners, sports club lobbies, university hallways'
  },
  {
    id: 'mall-kiosk',
    name: 'Standard Mall Kiosk',
    type: 'Turn-Key Island / Inline Kiosk',
    idealSpace: '8 - 14 sqm',
    investmentRange: '₱420,000 - ₱490,000',
    estimatedRoiMonths: '9 - 13 Months',
    popular: true,
    features: [
      'Full Turnkey Mall-Compliant Architectural Kiosk Design',
      '3x Commercial Ultra-Blend Units + Sound Housings',
      'Double Door Undercounter Glass Display Fridge',
      'Automated Commercial Cube Ice Maker (50kg/day)',
      'Digital Cloud POS + Barcode Customer Loyalty Reader',
      '1,000-Cup Initial Inventory (All Best Sellers + Cups/Straws)',
      'Comprehensive Operations Manual & Recipe Standards',
      'Grand Opening Social Media & Influencer Push'
    ],
    recommendedFor: 'SM, Ayala, and Robinsons shopping mall high-foot-traffic walkways'
  },
  {
    id: 'flagship-cafe',
    name: 'Wellness Lounge & Cafe',
    type: 'Inline Wellness Hub',
    idealSpace: '18 - 30 sqm',
    investmentRange: '₱680,000 - ₱780,000',
    estimatedRoiMonths: '11 - 15 Months',
    features: [
      'Dine-in aesthetic seating with modern green wellness lounge vibe',
      'Complete Profee Coffee Bar setup (Espresso Machine + Grinder)',
      '4x Commercial Blenders + Industrial Ice Machine (80kg/day)',
      'Açaí Bowl & Grab-and-Go Healthy Snack Section',
      'Dual POS Terminals + Mobile Order Ahead Pickup Station',
      'Exclusive Territory Protection within 3km radius',
      'Dedicated Area Field Supervisor & Regular Audits'
    ],
    recommendedFor: 'Prime high streets, lifestyle commercial centers, BPO hubs'
  }
];

export const FRANCHISE_FAQS = [
  {
    q: 'How much is the franchise fee and royalty?',
    a: 'Booost offers one of the lowest entry barriers in the healthy F&B sector with zero hidden royalties in year one and a low 3% marketing fund thereafter to continuously drive brand awareness.'
  },
  {
    q: 'Do I need prior food & beverage experience?',
    a: 'No! Our turn-key training system teaches you and your hired staff everything from standardized measuring, blender maintenance, inventory control, and customer service.'
  },
  {
    q: 'How fast can a branch open after approval?',
    a: 'Typically 30 to 45 days for mall kiosks, and 20 to 30 days for gym express counters, depending on mall leasing approval and construction permits.'
  },
  {
    q: 'Where are ingredients sourced?',
    a: 'All signature Booost protein formulas, superfood powders (spirulina, acai, Ceylon cinnamon), cups, and branded packaging are directly supplied via our centralized commissary.'
  }
];
