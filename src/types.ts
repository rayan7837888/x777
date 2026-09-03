export type NavigationPage = 'home' | 'engines' | 'trims' | 'gallery' | 'configurator' | 'employee' | 'admin';

export interface Employee {
  id: string;
  employeeCode: string; // 3 digits, e.g. '101', '707'
  fullName: string;
  role: string;
  phone: string;
  email: string;
  branch: string;
  hireDate: string;
  status: 'active' | 'suspended' | 'terminated';
  terminationDate?: string;
  terminationReason?: string;
  notes?: string;
  ordersHandled?: number;
}

export interface TestDriveAddon {
  id: string;
  nameAr: string;
  priceSAR: number; // in hundreds, e.g. 100, 200, 300, etc.
  descriptionAr: string;
  categoryAr?: string;
}

export interface CustomerOrder {
  id: string;
  code: string;
  type: 'test_drive' | 'custom_order';
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  trimId: string;
  trimNameAr: string;
  colorId?: string;
  colorNameAr?: string;
  colorHex?: string;
  stripeId?: string;
  stripeNameAr?: string;
  hasDodgeRedStripes?: boolean;
  wheelId?: string;
  wheelNameAr?: string;
  interiorId?: string;
  interiorNameAr?: string;
  totalPriceSAR: number;
  testDriveBasePriceSAR?: number; // 2000 SAR
  testDriveAddonsTotalSAR?: number; // extra hundreds
  testDriveAddons?: string[]; // list of addon titles
  preferredDate?: string;
  preferredTimeSlot?: string;
  status: 'pending' | 'accepted' | 'rejected';
  assignedEmployee?: string;
  rejectionReason?: string;
  staffNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface V8Engine {
  id: string;
  name: string;
  nameAr: string;
  displacement: string;
  horsepower: number;
  torque: number; // Nm
  acceleration0to100: number; // seconds
  topSpeed: number; // km/h
  towingCapacityKg: number;
  towingCapacityLbs: number;
  quarterMileSec: number;
  aspiration: string;
  aspirationAr: string;
  transmission: string;
  transmissionAr: string;
  soundType: 'hemi57' | 'hemi392' | 'hellcat62';
  descriptionAr: string;
  featuresAr: string[];
}

export interface DurangoTrim {
  id: string;
  name: string;
  nameAr: string;
  engineBadge: string;
  engineNameAr: string;
  priceSAR: number;
  priceUSD: number;
  horsepower: number;
  torque: number;
  acceleration: string;
  image: string;
  isSpecialEdition?: boolean;
  editionBadgeAr?: string;
  taglineAr: string;
  highlightsAr: string[];
  specs: {
    engine: string;
    transmission: string;
    drivetrain: string;
    wheels: string;
    brakes: string;
    interior: string;
  };
}

export interface GalleryItem {
  id: string;
  titleAr: string;
  category: 'all' | 'exterior' | 'interior' | 'engine' | 'track';
  categoryAr: string;
  imageUrl: string;
  descriptionAr: string;
  specsHighlight?: string;
}

export interface ColorOption {
  id: string;
  nameAr: string;
  nameEn: string;
  hex: string;
  carTint: string; // CSS color filter/overlay
  finishAr: string;
}

export interface WheelOption {
  id: string;
  nameAr: string;
  size: string;
  finish: string;
  priceSAR: number;
}

export interface StripeOption {
  id: string;
  nameAr: string;
  color: string;
  stripeClass: string;
  isDodgeSignature?: boolean;
}

export interface InteriorOption {
  id: string;
  nameAr: string;
  materialAr: string;
  accentColor: string;
  accentHex: string;
}

export type StaffChatChannelId = 'general' | 'sales' | 'track' | 'management';

export interface ChatReaction {
  emoji: string;
  count: number;
  users: string[]; // employee codes or names
}

export interface StaffChatMessage {
  id: string;
  channelId: StaffChatChannelId;
  senderId: string;
  senderCode: string;
  senderName: string;
  senderRole: string;
  senderBranch: string;
  content: string;
  timestamp: string;
  isUrgent?: boolean;
  isAnnouncement?: boolean;
  pinned?: boolean;
  reactions?: Record<string, string[]>; // emoji -> [employeeCodes]
}

export interface StaffPresence {
  employeeId: string;
  employeeCode: string;
  fullName: string;
  role: string;
  branch: string;
  status: 'online' | 'busy' | 'away';
  lastActive: string;
  activeChannel?: StaffChatChannelId;
}

