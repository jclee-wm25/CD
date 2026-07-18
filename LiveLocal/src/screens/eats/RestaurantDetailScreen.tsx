// ============================================
// LiveLocal - Restaurant Detail Screen
// ============================================
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
} from '../../theme';
import { Restaurant, CuisineType, RootStackParamList, Review } from '../../types';
import { MOCK_RESTAURANTS } from '../../data/restaurants';
import { useSaved } from '../../contexts/SavedContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ---- Cuisine styling ----
const CUISINE_CONFIG: Record<CuisineType, { gradient: [string, string]; emoji: string; badgeColor: string }> = {
  Malay:    { gradient: ['#E65100', '#FF8F00'], emoji: '🍛', badgeColor: '#FF8F00' },
  Chinese:  { gradient: ['#B71C1C', '#E53935'], emoji: '🥢', badgeColor: '#E53935' },
  Indian:   { gradient: ['#F57F17', '#FFD600'], emoji: '🫓', badgeColor: '#F9A825' },
  Mamak:    { gradient: ['#BF360C', '#FF6E40'], emoji: '🍜', badgeColor: '#FF6E40' },
  Nyonya:   { gradient: ['#880E4F', '#E91E63'], emoji: '🥘', badgeColor: '#E91E63' },
  Western:  { gradient: ['#1B5E20', '#43A047'], emoji: '🍔', badgeColor: '#43A047' },
  Japanese: { gradient: ['#311B92', '#7C4DFF'], emoji: '🍣', badgeColor: '#7C4DFF' },
  Thai:     { gradient: ['#E65100', '#FF9100'], emoji: '🍲', badgeColor: '#FF9100' },
  Fusion:   { gradient: ['#4A148C', '#AB47BC'], emoji: '🍽️', badgeColor: '#AB47BC' },
  Seafood:  { gradient: ['#01579B', '#039BE5'], emoji: '🦐', badgeColor: '#039BE5' },
  Dessert:  { gradient: ['#AD1457', '#F06292'], emoji: '🍧', badgeColor: '#F06292' },
};

// ---- Mock community reviews ----
const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-r-001',
    userId: 'user-003',
    userName: 'Sarah L.',
    targetId: '',
    targetType: 'restaurant',
    starRating: 5,
    reviewText: 'Absolutely incredible! The flavours are authentic and the portions are generous. Will definitely come back! 🔥',
    isFlagged: false,
    createdAt: '2026-07-10T09:00:00Z',
  },
  {
    id: 'rev-r-002',
    userId: 'user-005',
    userName: 'Ahmad K.',
    targetId: '',
    targetType: 'restaurant',
    starRating: 4,
    reviewText: 'Great food, slightly crowded during peak hours but totally worth the wait. The sambal is the best I\'ve had!',
    isFlagged: false,
    createdAt: '2026-07-08T15:00:00Z',
  },
];

// ---- Star renderer ----
const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= Math.round(rating) ? 'star' : 'star-outline'}
        size={size}
        color={i <= Math.round(rating) ? COLORS.starFilled : COLORS.starEmpty}
        style={{ marginRight: 2 }}
      />,
    );
  }
  return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{stars}</View>;
};

// ---- Interactive star picker ----
const StarPicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <TouchableOpacity key={s} onPress={() => onChange(s)} style={{ paddingHorizontal: 3 }}>
        <Ionicons
          name={s <= value ? 'star' : 'star-outline'}
          size={28}
          color={s <= value ? COLORS.starFilled : COLORS.starEmpty}
        />
      </TouchableOpacity>
    ))}
  </View>
);

// ==============================
// Main Screen Component
// ==============================
export default function RestaurantDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'RestaurantDetail'>>();
  const { restaurantId } = route.params;
  const { isSaved, toggleSave } = useSaved();

  const restaurant = MOCK_RESTAURANTS.find((r) => r.id === restaurantId);

  // -- Review form state --
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>([]);

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>🍽️</Text>
          <Text style={styles.errorText}>Restaurant not found</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const config = CUISINE_CONFIG[restaurant.cuisineType];
  const saved = isSaved(restaurant.id);
  const platformIcon = restaurant.socialMediaPlatform === 'tiktok' ? '📱' : '📷';
  const platformLabel = restaurant.socialMediaPlatform === 'tiktok' ? 'TikTok' : 'Instagram';

  // -- Filter expired discount codes --
  const now = new Date();
  const validCodes = restaurant.discountCodes.filter(
    (dc) => new Date(dc.expiryDate) > now,
  );

  const allReviews = [...MOCK_REVIEWS, ...submittedReviews];

  const handleCopyCode = (code: string) => {
    Alert.alert('Code Copied! 📋', `"${code}" has been copied to your clipboard.\n\nShow this code when you visit the restaurant.`);
  };

  const handleWatchReview = () => {
    Alert.alert(
      `Watch on ${platformLabel} ${platformIcon}`,
      `Opening review by ${restaurant.influencerName}:\n\n${restaurant.socialMediaUrl}`,
      [{ text: 'OK', style: 'default' }],
    );
  };

  const handleToggleSave = () => {
    toggleSave('user-001', restaurant.id, 'restaurant');
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting.');
      return;
    }
    if (reviewText.trim().length < 5) {
      Alert.alert('Review Too Short', 'Please write at least 5 characters.');
      return;
    }
    const newReview: Review = {
      id: `rev-user-${Date.now()}`,
      userId: 'user-001',
      userName: 'You',
      targetId: restaurant.id,
      targetType: 'restaurant',
      starRating: reviewRating,
      reviewText: reviewText.trim(),
      isFlagged: false,
      createdAt: new Date().toISOString(),
    };
    setSubmittedReviews((prev) => [newReview, ...prev]);
    setReviewText('');
    setReviewRating(0);
    Alert.alert('Thank you! 🎉', 'Your review has been submitted.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ---- Hero ---- */}
        <LinearGradient
          colors={[config.gradient[0], config.gradient[1], COLORS.background]}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Text style={styles.heroEmoji}>{config.emoji}</Text>

          {/* Nav overlay */}
          <View style={styles.heroNav}>
            <TouchableOpacity style={styles.navCircle} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navCircle} onPress={handleToggleSave}>
              <Ionicons name={saved ? 'heart' : 'heart-outline'} size={22} color={saved ? COLORS.error : '#fff'} />
            </TouchableOpacity>
          </View>

          {/* Price badge */}
          <View style={styles.heroPriceBadge}>
            <Text style={styles.heroPriceText}>{restaurant.priceRange}</Text>
          </View>
        </LinearGradient>

        {/* ---- Info Section ---- */}
        <View style={styles.infoSection}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>

          <View style={styles.metaRow}>
            <View style={[styles.cuisineBadge, { backgroundColor: config.badgeColor + '25' }]}>
              <Text style={[styles.cuisineBadgeText, { color: config.badgeColor }]}>
                {config.emoji} {restaurant.cuisineType}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <StarRating rating={restaurant.rating} />
              <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCountText}>({restaurant.reviewCount})</Text>
            </View>
          </View>

          {/* Address */}
          <View style={styles.addressRow}>
            <Ionicons name="location" size={16} color={COLORS.primary} />
            <Text style={styles.addressText}>{restaurant.address}</Text>
          </View>
          <View style={styles.addressRow}>
            <Ionicons name="navigate-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.cityText}>{restaurant.city}, {restaurant.state}</Text>
          </View>
        </View>

        {/* ---- Discount Codes ---- */}
        {validCodes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏷️ Exclusive Deals</Text>
            {validCodes.map((dc) => (
              <LinearGradient
                key={dc.id}
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.discountCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.discountTop}>
                  <View style={styles.discountCodeBox}>
                    <Text style={styles.discountCodeText}>{dc.code}</Text>
                  </View>
                  <TouchableOpacity style={styles.copyBtn} onPress={() => handleCopyCode(dc.code)}>
                    <Ionicons name="copy-outline" size={16} color="#fff" />
                    <Text style={styles.copyBtnText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.discountDesc}>{dc.description}</Text>
                <View style={styles.expiryRow}>
                  <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.expiryText}>
                    Expires {new Date(dc.expiryDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Text>
                </View>
              </LinearGradient>
            ))}
          </View>
        )}

        {/* ---- Reviewed Dishes ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍽️ Reviewed Dishes</Text>
          <View style={styles.dishChipsContainer}>
            {restaurant.reviewedDishes.map((dish, idx) => (
              <View key={idx} style={styles.dishChip}>
                <Text style={styles.dishChipText}>{dish}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ---- Influencer Section ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{platformIcon} Influencer Review</Text>
          <View style={styles.influencerCard}>
            <LinearGradient
              colors={[COLORS.surface, COLORS.card]}
              style={styles.influencerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.influencerAvatar}>
                <Text style={styles.influencerAvatarText}>
                  {restaurant.influencerName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.influencerInfo}>
                <Text style={styles.influencerNameText}>{restaurant.influencerName}</Text>
                <Text style={styles.influencerPlatformText}>
                  {platformIcon} {platformLabel} Creator
                </Text>
              </View>
            </LinearGradient>
            <TouchableOpacity style={styles.watchBtn} onPress={handleWatchReview}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.watchBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="play-circle-outline" size={18} color="#fff" />
                <Text style={styles.watchBtnText}>Watch Review</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* ---- Community Reviews ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Community Reviews</Text>
          {allReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatarSmall}>
                  <Text style={styles.reviewAvatarLetter}>{review.userName.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewUserName}>{review.userName}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Text>
                </View>
                <StarRating rating={review.starRating} size={12} />
              </View>
              <Text style={styles.reviewBody}>{review.reviewText}</Text>
            </View>
          ))}
        </View>

        {/* ---- Write a Review ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✍️ Write a Review</Text>
          <View style={styles.writeReviewCard}>
            <Text style={styles.writeLabel}>Your Rating</Text>
            <StarPicker value={reviewRating} onChange={setReviewRating} />

            <Text style={[styles.writeLabel, { marginTop: SPACING.lg }]}>Your Review</Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Share your experience..."
              placeholderTextColor={COLORS.textMuted}
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitReview}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.submitBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="send" size={16} color="#fff" />
                <Text style={styles.submitBtnText}>Submit Review</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ==============================
// Styles
// ==============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },

  // -- Error --
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorEmoji: {
    fontSize: 56,
    marginBottom: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  backBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.md,
  },

  // -- Hero --
  hero: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroEmoji: {
    fontSize: 80,
    opacity: 0.75,
  },
  heroNav: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPriceBadge: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  heroPriceText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.warning,
  },

  // -- Info --
  infoSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  restaurantName: {
    fontSize: FONT_SIZES.xxl + 2,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  cuisineBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.round,
  },
  cuisineBadgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.starFilled,
    marginLeft: SPACING.xs,
  },
  reviewCountText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  addressText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  cityText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
  },

  // -- Section --
  section: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  // -- Discount code --
  discountCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.glow,
  },
  discountTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  discountCodeBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
  },
  discountCodeText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: '#fff',
    letterSpacing: 2,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  copyBtnText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#fff',
    marginLeft: SPACING.xs,
  },
  discountDesc: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.sm,
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: SPACING.xs,
  },

  // -- Dish chips --
  dishChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dishChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dishChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },

  // -- Influencer --
  influencerCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  influencerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  influencerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  influencerAvatarText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#fff',
  },
  influencerInfo: {
    flex: 1,
  },
  influencerNameText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  influencerPlatformText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  watchBtn: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  watchBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  watchBtnText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#fff',
    marginLeft: SPACING.sm,
  },

  // -- Reviews --
  reviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  reviewAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  reviewAvatarLetter: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  reviewUserName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  reviewDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  reviewBody: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // -- Write review --
  writeReviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  writeLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  reviewInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submitBtn: {
    marginTop: SPACING.lg,
  },
  submitBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md + 2,
    borderRadius: BORDER_RADIUS.md,
  },
  submitBtnText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#fff',
    marginLeft: SPACING.sm,
  },
});
