// ============================================
// LiveLocal - Spot Detail Screen
// ============================================
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
} from '../../theme';
import { RootStackParamList, SpotCategory, Review } from '../../types';
import { MOCK_SPOTS } from '../../data/spots';
import { useSaved } from '../../contexts/SavedContext';
import { useAuth } from '../../contexts/AuthContext';

type DetailRouteProp = RouteProp<RootStackParamList, 'SpotDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ---- Category helpers ----
const CATEGORY_CONFIG: Record<SpotCategory, { emoji: string; gradient: [string, string]; color: string }> = {
  Kopitiam:       { emoji: '☕', gradient: ['#5D4037', '#795548'], color: '#795548' },
  'Hawker Stall': { emoji: '🍜', gradient: ['#E65100', '#FF8F00'], color: '#FF8F00' },
  'Night Market': { emoji: '🏮', gradient: ['#880E4F', '#AD1457'], color: '#AD1457' },
  Park:           { emoji: '🌿', gradient: ['#1B5E20', '#388E3C'], color: '#388E3C' },
  Cafe:           { emoji: '🧁', gradient: ['#4E342E', '#6D4C41'], color: '#6D4C41' },
  Temple:         { emoji: '🛕', gradient: ['#BF360C', '#E64A19'], color: '#E64A19' },
  'Street Art':   { emoji: '🎨', gradient: ['#4A148C', '#7B1FA2'], color: '#7B1FA2' },
  Beach:          { emoji: '🏖️', gradient: ['#01579B', '#0288D1'], color: '#0288D1' },
  Market:         { emoji: '🛒', gradient: ['#F57F17', '#FBC02D'], color: '#FBC02D' },
  Heritage:       { emoji: '🏛️', gradient: ['#3E2723', '#5D4037'], color: '#5D4037' },
};

// ---- Mock reviews ----
const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    userId: 'user-005',
    userName: 'Sarah Lim',
    targetId: '',
    targetType: 'spot',
    starRating: 5,
    reviewText: 'Absolutely amazing! The locals were so friendly and the atmosphere is something you can\'t find in touristy areas. A must-visit!',
    isFlagged: false,
    createdAt: '2026-06-20T14:30:00Z',
  },
  {
    id: 'rev-002',
    userId: 'user-001',
    userName: 'Ahmad Razak',
    targetId: '',
    targetType: 'spot',
    starRating: 4,
    reviewText: 'Great hidden gem! Went with my family last weekend. The vibe is authentic and prices are very reasonable. Will definitely come back.',
    isFlagged: false,
    createdAt: '2026-06-15T09:00:00Z',
  },
  {
    id: 'rev-003',
    userId: 'user-003',
    userName: 'Mei Ling',
    targetId: '',
    targetType: 'spot',
    starRating: 5,
    reviewText: 'This is what travel should be about — real experiences with real people. The food was incredible and so cheap!',
    isFlagged: false,
    createdAt: '2026-05-28T18:00:00Z',
  },
];

// ---- Rating stars ----
function RatingStars({ rating, size = 16 }: { rating: number; size?: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text
        key={i}
        style={{
          fontSize: size,
          color: i <= Math.round(rating) ? COLORS.starFilled : COLORS.starEmpty,
          marginRight: 2,
        }}
      >
        ★
      </Text>
    );
  }
  return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{stars}</View>;
}

// ---- Interactive star selector ----
function StarSelector({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (r: number) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity key={i} onPress={() => onChange(i)} activeOpacity={0.7}>
          <Text
            style={{
              fontSize: 32,
              color: i <= rating ? COLORS.starFilled : COLORS.starEmpty,
            }}
          >
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ---- Info card component ----
function InfoCard({
  icon,
  title,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoCardHeader}>
        <View style={styles.infoCardIcon}>
          <Ionicons name={icon} size={18} color={COLORS.primary} />
        </View>
        <Text style={styles.infoCardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

// ---- Main screen ----
export default function SpotDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const { spotId } = route.params;
  const { isSaved, toggleSave } = useSaved();
  const { user } = useAuth();

  // Find spot
  const spot = useMemo(
    () => MOCK_SPOTS.find((s) => s.id === spotId),
    [spotId]
  );

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>([]);

  if (!spot) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.notFoundText}>Spot not found</Text>
          <TouchableOpacity
            style={styles.backButtonAlt}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonAltText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const config = CATEGORY_CONFIG[spot.category];
  const saved = isSaved(spot.id);
  const allReviews = [...MOCK_REVIEWS, ...submittedReviews];

  const handleSave = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to save spots.');
      return;
    }
    toggleSave(user.id, spot.id, 'spot');
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating.');
      return;
    }
    if (!reviewText.trim()) {
      Alert.alert('Review Required', 'Please write your review.');
      return;
    }
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userId: user?.id || 'anon',
      userName: user?.name || 'Anonymous',
      targetId: spot.id,
      targetType: 'spot',
      starRating: reviewRating,
      reviewText: reviewText.trim(),
      isFlagged: false,
      createdAt: new Date().toISOString(),
    };
    setSubmittedReviews((prev) => [newReview, ...prev]);
    setReviewRating(0);
    setReviewText('');
    Alert.alert('Thank You! 🎉', 'Your review has been submitted successfully.');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero */}
        <View style={styles.heroWrapper}>
          <LinearGradient
            colors={config.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <Text style={styles.heroEmoji}>{config.emoji}</Text>
          </LinearGradient>

          {/* Overlay buttons */}
          <View style={styles.heroOverlay}>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.heroButton} onPress={handleSave}>
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={22}
                color={saved ? COLORS.error : COLORS.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title section */}
        <View style={styles.titleSection}>
          <View style={[styles.categoryBadge, { backgroundColor: config.color + '30' }]}>
            <Text style={[styles.categoryBadgeText, { color: config.color }]}>
              {config.emoji} {spot.category}
            </Text>
          </View>

          <Text style={styles.spotName}>{spot.name}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={COLORS.primary} />
            <Text style={styles.locationText}>
              {spot.city}, {spot.state}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <RatingStars rating={spot.rating} size={18} />
            <Text style={styles.ratingNumber}>{spot.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCountText}>({spot.reviewCount} reviews)</Text>
            <View style={{ flex: 1 }} />
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>{spot.priceRange}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <InfoCard icon="document-text-outline" title="About">
          <Text style={styles.infoText}>{spot.description}</Text>
        </InfoCard>

        {/* Why Locals Go Here */}
        <InfoCard icon="people-outline" title="Why Locals Go Here">
          <Text style={styles.infoText}>{spot.whyLocalsGoHere}</Text>
        </InfoCard>

        {/* Best Visiting Time */}
        <InfoCard icon="time-outline" title="Best Visiting Time">
          <View style={styles.timeChip}>
            <Ionicons name="sunny-outline" size={16} color={COLORS.warning} />
            <Text style={styles.timeText}>{spot.bestVisitingTime}</Text>
          </View>
        </InfoCard>

        {/* Things to Do */}
        <InfoCard icon="checkmark-circle-outline" title="Things to Do">
          {spot.thingsToDo.map((item, idx) => (
            <View key={idx} style={styles.todoItem}>
              <View style={styles.todoBullet}>
                <Text style={styles.todoBulletText}>{idx + 1}</Text>
              </View>
              <Text style={styles.todoText}>{item}</Text>
            </View>
          ))}
        </InfoCard>

        {/* Address */}
        <InfoCard icon="map-outline" title="Address">
          <TouchableOpacity style={styles.addressCard}>
            <Text style={styles.addressText}>{spot.address}</Text>
            <View style={styles.addressAction}>
              <Ionicons name="navigate-outline" size={16} color={COLORS.primary} />
              <Text style={styles.addressActionText}>Get Directions</Text>
            </View>
          </TouchableOpacity>
        </InfoCard>

        {/* Community Reviews */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community Reviews</Text>
            <Text style={styles.sectionCount}>{allReviews.length}</Text>
          </View>

          {allReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryLight]}
                  style={styles.reviewAvatar}
                >
                  <Text style={styles.reviewAvatarText}>
                    {review.userName.charAt(0).toUpperCase()}
                  </Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewName}>{review.userName}</Text>
                  <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
                </View>
                <RatingStars rating={review.starRating} size={14} />
              </View>
              <Text style={styles.reviewText}>{review.reviewText}</Text>
            </View>
          ))}
        </View>

        {/* Write a Review */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Write a Review</Text>
          <View style={styles.writeReviewCard}>
            <Text style={styles.writeReviewLabel}>Your Rating</Text>
            <StarSelector rating={reviewRating} onChange={setReviewRating} />

            <Text style={[styles.writeReviewLabel, { marginTop: SPACING.lg }]}>
              Your Review
            </Text>
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

            <TouchableOpacity
              style={styles.submitReviewButton}
              onPress={handleSubmitReview}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                style={styles.submitReviewGradient}
              >
                <Ionicons name="send" size={18} color="#FFF" />
                <Text style={styles.submitReviewText}>Submit Review</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---- Styles ----
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Not found
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  notFoundText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
  },
  backButtonAlt: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  backButtonAltText: {
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semibold,
  },

  // Hero
  heroWrapper: {
    position: 'relative',
  },
  hero: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 80,
  },
  heroOverlay: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.background + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },

  // Title section
  titleSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    marginBottom: SPACING.md,
  },
  categoryBadgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  spotName: {
    fontSize: FONT_SIZES.huge,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  locationText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.starFilled,
    marginLeft: SPACING.sm,
  },
  reviewCountText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  priceTag: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  priceText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.success,
  },

  // Info cards
  infoCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  infoCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '18',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  infoCardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  infoText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  // Time chip
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  timeText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.warning,
    fontWeight: FONT_WEIGHTS.medium,
    marginLeft: SPACING.sm,
  },

  // Things to do
  todoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  todoBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginTop: 1,
  },
  todoBulletText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  todoText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  // Address
  addressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  addressText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  addressAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressActionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
    marginLeft: 6,
  },

  // Reviews section
  sectionContainer: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  sectionCount: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.round,
    marginLeft: SPACING.sm,
    overflow: 'hidden',
  },

  // Review card
  reviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  reviewAvatarText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFF',
  },
  reviewName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  reviewDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  reviewText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  // Write review
  writeReviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginTop: SPACING.md,
    ...SHADOWS.sm,
  },
  writeReviewLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  reviewInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submitReviewButton: {
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  submitReviewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  submitReviewText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFF',
  },
});
