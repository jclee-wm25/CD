// ============================================
// LiveLocal - Spot Card Component
// ============================================
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme';
import { Spot } from '../types';
import StarRating from './StarRating';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;

interface SpotCardProps {
  spot: Spot;
  onPress?: () => void;
  fullWidth?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Kopitiam: '#8B5CF6',
  'Hawker Stall': '#F59E0B',
  'Night Market': '#EC4899',
  Park: '#10B981',
  Cafe: '#6366F1',
  Temple: '#EF4444',
  'Street Art': '#14B8A6',
  Beach: '#0EA5E9',
  Market: '#F97316',
  Heritage: '#A855F7',
};

const SpotCard: React.FC<SpotCardProps> = ({ spot, onPress, fullWidth = false }) => {
  const categoryColor = CATEGORY_COLORS[spot.category] || COLORS.primary;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        fullWidth && styles.cardFullWidth,
        SHADOWS.md,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Photo / Placeholder */}
      <View style={styles.imageContainer}>
        {spot.photos && spot.photos.length > 0 ? (
          <Image source={{ uri: spot.photos[0] }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={40} color={COLORS.textMuted} />
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(10,14,33,0.85)']}
          style={styles.gradient}
        />
        {/* Category Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{spot.category}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {spot.name}
        </Text>

        {/* Location */}
        <View style={styles.row}>
          <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {spot.city}, {spot.state}
          </Text>
        </View>

        {/* Bottom row: Price + Rating */}
        <View style={styles.bottomRow}>
          <Text style={styles.price}>{spot.priceRange}</Text>

          <View style={styles.ratingRow}>
            <StarRating rating={spot.rating} size={13} />
            <Text style={styles.reviewCount}>({spot.reviewCount})</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginRight: SPACING.md,
  },
  cardFullWidth: {
    width: '100%',
    marginRight: 0,
    marginBottom: SPACING.lg,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  categoryBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.5,
  },
  content: {
    padding: SPACING.md,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  locationText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    color: COLORS.success,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  reviewCount: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
  },
});

export default SpotCard;
