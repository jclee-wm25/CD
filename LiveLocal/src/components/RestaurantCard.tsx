// ============================================
// LiveLocal - Restaurant Card Component
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
import { Restaurant } from '../types';
import StarRating from './StarRating';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress?: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress }) => {
  const hasDeal = restaurant.discountCodes.length > 0;
  const platformIcon = restaurant.socialMediaPlatform === 'tiktok' ? 'logo-tiktok' : 'logo-instagram';
  const platformColor =
    restaurant.socialMediaPlatform === 'tiktok' ? COLORS.textPrimary : COLORS.instagram;

  return (
    <TouchableOpacity
      style={[styles.card, SHADOWS.md]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Cover Photo */}
      <View style={styles.imageContainer}>
        {restaurant.coverPhoto ? (
          <Image source={{ uri: restaurant.coverPhoto }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="restaurant-outline" size={40} color={COLORS.textMuted} />
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(10,14,33,0.9)']}
          style={styles.gradient}
        />

        {/* Deal Badge */}
        {hasDeal && (
          <View style={styles.dealBadge}>
            <Ionicons name="pricetag" size={10} color={COLORS.textPrimary} />
            <Text style={styles.dealText}>HAS DEAL</Text>
          </View>
        )}

        {/* Cuisine Badge */}
        <View style={styles.cuisineBadge}>
          <Text style={styles.cuisineText}>{restaurant.cuisineType}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <Text style={styles.price}>{restaurant.priceRange}</Text>
        </View>

        {/* Influencer Row */}
        <View style={styles.influencerRow}>
          <View style={styles.avatarIndicator}>
            <Ionicons name="person" size={10} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.influencerName} numberOfLines={1}>
            {restaurant.influencerName}
          </Text>
          <Ionicons name={platformIcon as any} size={14} color={platformColor} />
        </View>

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <StarRating rating={restaurant.rating} size={13} />
          <Text style={styles.reviewCount}>({restaurant.reviewCount})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  imageContainer: {
    width: '100%',
    height: 160,
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
    height: 70,
  },
  dealBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  dealText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.extrabold,
    letterSpacing: 0.8,
  },
  cuisineBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  cuisineText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.5,
  },
  content: {
    padding: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    flex: 1,
    marginRight: SPACING.sm,
  },
  price: {
    color: COLORS.success,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  influencerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  avatarIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  influencerName: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    flex: 1,
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

export default RestaurantCard;
