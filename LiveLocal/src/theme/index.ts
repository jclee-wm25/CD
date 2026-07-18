// ============================================
// LiveLocal - Design System & Theme
// ============================================

export const COLORS = {
  // Primary palette
  primary: '#FF6B35',
  primaryLight: '#FF8B5E',
  primaryDark: '#E55A25',

  // Secondary palette
  secondary: '#004E89',
  secondaryLight: '#1A6BA8',

  // Accent
  accent: '#00B4D8',
  accentLight: '#48CAE4',

  // Dark theme backgrounds
  background: '#0A0E21',
  card: '#1A1F36',
  surface: '#252A45',
  surfaceLight: '#2F3555',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A3BD',
  textMuted: '#6B6F8A',
  textInverse: '#0A0E21',

  // Semantic
  success: '#00C48C',
  warning: '#FFB800',
  error: '#FF4757',
  info: '#00B4D8',

  // Others
  border: '#2F3555',
  overlay: 'rgba(10, 14, 33, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',

  // Star rating
  starFilled: '#FFB800',
  starEmpty: '#3A3F5C',

  // Social media
  tiktok: '#000000',
  instagram: '#E4405F',

  // Status
  pending: '#FFB800',
  approved: '#00C48C',
  rejected: '#FF4757',

  // Gradient stops
  gradientStart: '#FF6B35',
  gradientEnd: '#FF8B5E',
  gradientBlueStart: '#004E89',
  gradientBlueEnd: '#00B4D8',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  huge: 34,
};

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};
