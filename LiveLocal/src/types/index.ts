// ============================================
// LiveLocal - Core Type Definitions
// ============================================

// ---- User & Auth Types ----
export type UserRole = 'tourist' | 'influencer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  profilePhoto?: string;
  bio?: string;
  location?: string;
  socialMedia?: {
    tiktok?: string;
    instagram?: string;
  };
  influencerStatus?: 'pending' | 'approved' | 'rejected';
  isSuspended?: boolean;
  createdAt: string;
}

// ---- Local Spots Types ----
export type SpotCategory =
  | 'Kopitiam'
  | 'Hawker Stall'
  | 'Night Market'
  | 'Park'
  | 'Cafe'
  | 'Temple'
  | 'Street Art'
  | 'Beach'
  | 'Market'
  | 'Heritage';

export type MalaysianState =
  | 'Johor'
  | 'Kedah'
  | 'Kelantan'
  | 'Melaka'
  | 'Negeri Sembilan'
  | 'Pahang'
  | 'Perak'
  | 'Perlis'
  | 'Pulau Pinang'
  | 'Sabah'
  | 'Sarawak'
  | 'Selangor'
  | 'Terengganu'
  | 'Kuala Lumpur'
  | 'Putrajaya'
  | 'Labuan';

export type PriceRange = '$' | '$$' | '$$$';

export type SpotStatus = 'pending' | 'approved' | 'rejected';

export interface Spot {
  id: string;
  name: string;
  category: SpotCategory;
  state: MalaysianState;
  city: string;
  description: string;
  whyLocalsGoHere: string;
  bestVisitingTime: string;
  thingsToDo: string[];
  address: string;
  priceRange: PriceRange;
  photos: string[];
  rating: number;
  reviewCount: number;
  status: SpotStatus;
  submittedBy: string;
  rejectionReason?: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

// ---- LocalEats / Restaurant Types ----
export type CuisineType =
  | 'Malay'
  | 'Chinese'
  | 'Indian'
  | 'Mamak'
  | 'Nyonya'
  | 'Western'
  | 'Japanese'
  | 'Thai'
  | 'Fusion'
  | 'Seafood'
  | 'Dessert';

export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  expiryDate: string;
  influencerId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  state: MalaysianState;
  city: string;
  cuisineType: CuisineType;
  priceRange: PriceRange;
  reviewedDishes: string[];
  influencerId: string;
  influencerName: string;
  socialMediaUrl: string;
  socialMediaPlatform: 'tiktok' | 'instagram';
  coverPhoto: string;
  rating: number;
  reviewCount: number;
  discountCodes: DiscountCode[];
  latitude: number;
  longitude: number;
  lastReviewDate: string;
  createdAt: string;
}

// ---- Neighbourhood Explorer Types ----
export interface GuideStop {
  id: string;
  name: string;
  description: string;
  localTip: string;
  estimatedTime: string;
  latitude: number;
  longitude: number;
}

export interface NeighbourhoodGuide {
  id: string;
  title: string;
  state: MalaysianState;
  city: string;
  introduction: string;
  estimatedDuration: string;
  coverPhoto: string;
  stops: GuideStop[];
  status: SpotStatus;
  createdAt: string;
}

// ---- Review Types ----
export interface Review {
  id: string;
  userId: string;
  userName: string;
  targetId: string;
  targetType: 'spot' | 'restaurant';
  starRating: number;
  reviewText: string;
  photos?: string[];
  isFlagged: boolean;
  flagReason?: string;
  createdAt: string;
}

// ---- Saved Places Types ----
export interface SavedPlace {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'spot' | 'restaurant';
  savedAt: string;
}

// ---- Notification Types ----
export type NotificationType =
  | 'spot_approved'
  | 'spot_rejected'
  | 'new_discount'
  | 'new_trending'
  | 'review_flagged'
  | 'review_removed'
  | 'influencer_approved'
  | 'influencer_rejected';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

// ---- Navigation Types ----
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  SpotDetail: { spotId: string };
  SubmitSpot: undefined;
  RestaurantDetail: { restaurantId: string };
  GuideDetail: { guideId: string };
  EditProfile: undefined;
  Itinerary: undefined;
  Notifications: undefined;
  AdminDashboard: undefined;
  PendingSpots: undefined;
  FlaggedReviews: undefined;
};

export type TabParamList = {
  Discover: undefined;
  LocalEats: undefined;
  Explore: undefined;
  Saved: undefined;
  Profile: undefined;
};
