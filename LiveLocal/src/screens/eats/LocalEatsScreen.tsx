// ============================================
// LiveLocal - LocalEats Screen
// ============================================
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
} from '../../theme';
import { Restaurant, CuisineType, MalaysianState, PriceRange, RootStackParamList } from '../../types';
import { MOCK_RESTAURANTS } from '../../data/restaurants';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRENDING_CARD_WIDTH = SCREEN_WIDTH * 0.52;

// ---- Cuisine color / emoji mappings ----
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

const ALL_CUISINES: CuisineType[] = [
  'Malay', 'Chinese', 'Indian', 'Mamak', 'Nyonya', 'Western',
  'Japanese', 'Thai', 'Fusion', 'Seafood', 'Dessert',
];

const PRICE_OPTIONS: PriceRange[] = ['$', '$$', '$$$'];

const STATES: MalaysianState[] = [
  'Kuala Lumpur', 'Selangor', 'Pulau Pinang', 'Johor', 'Melaka',
  'Perak', 'Kelantan', 'Kedah', 'Pahang', 'Negeri Sembilan',
  'Terengganu', 'Sabah', 'Sarawak', 'Perlis', 'Putrajaya', 'Labuan',
];

// ---- Star renderer ----
const StarRating = ({ rating, size = 14 }: { rating: number; size?: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= Math.round(rating) ? 'star' : 'star-outline'}
        size={size}
        color={i <= Math.round(rating) ? COLORS.starFilled : COLORS.starEmpty}
        style={{ marginRight: 1 }}
      />,
    );
  }
  return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{stars}</View>;
};

// ==============================
// Main Screen Component
// ==============================
export default function LocalEatsScreen() {
  const navigation = useNavigation<Nav>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType | null>(null);
  const [selectedState, setSelectedState] = useState<MalaysianState | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<PriceRange | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // -- Trending restaurants (top 5 by lastReviewDate) --
  const trendingRestaurants = useMemo(
    () =>
      [...MOCK_RESTAURANTS]
        .sort((a, b) => new Date(b.lastReviewDate).getTime() - new Date(a.lastReviewDate).getTime())
        .slice(0, 5),
    [],
  );

  // -- Filtered list --
  const filteredRestaurants = useMemo(() => {
    let list = [...MOCK_RESTAURANTS];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) => r.name.toLowerCase().includes(q) || r.cuisineType.toLowerCase().includes(q),
      );
    }
    if (selectedCuisine) list = list.filter((r) => r.cuisineType === selectedCuisine);
    if (selectedState) list = list.filter((r) => r.state === selectedState);
    if (selectedPrice) list = list.filter((r) => r.priceRange === selectedPrice);
    return list;
  }, [searchQuery, selectedCuisine, selectedState, selectedPrice]);

  const handleOpenDetail = useCallback(
    (id: string) => navigation.navigate('RestaurantDetail', { restaurantId: id }),
    [navigation],
  );

  // ---- Render helpers ----
  const renderTrendingCard = ({ item }: { item: Restaurant }) => {
    const config = CUISINE_CONFIG[item.cuisineType];
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.trendingCard}
        onPress={() => handleOpenDetail(item.id)}
      >
        <LinearGradient colors={config.gradient} style={styles.trendingPhoto} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.trendingEmoji}>{config.emoji}</Text>
          <View style={styles.trendingBadge}>
            <Text style={styles.trendingBadgeText}>TRENDING 🔥</Text>
          </View>
        </LinearGradient>
        <View style={styles.trendingInfo}>
          <Text style={styles.trendingName} numberOfLines={1}>{item.name}</Text>
          <View style={[styles.cuisineBadge, { backgroundColor: config.badgeColor + '30' }]}>
            <Text style={[styles.cuisineBadgeText, { color: config.badgeColor }]}>{item.cuisineType}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRestaurantCard = ({ item }: { item: Restaurant }) => {
    const config = CUISINE_CONFIG[item.cuisineType];
    const platformIcon = item.socialMediaPlatform === 'tiktok' ? '📱' : '📷';
    const hasDeals = item.discountCodes.length > 0;

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.restaurantCard}
        onPress={() => handleOpenDetail(item.id)}
      >
        {/* Cover photo area */}
        <LinearGradient
          colors={[config.gradient[0], config.gradient[1], 'rgba(0,0,0,0.4)']}
          style={styles.coverPhoto}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.coverEmoji}>{config.emoji}</Text>
          {hasDeals && (
            <View style={styles.dealBadge}>
              <Text style={styles.dealBadgeText}>DEAL 🏷️</Text>
            </View>
          )}
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{item.priceRange}</Text>
          </View>
        </LinearGradient>

        {/* Info section */}
        <View style={styles.cardInfo}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
            <View style={[styles.cuisineBadge, { backgroundColor: config.badgeColor + '25' }]}>
              <Text style={[styles.cuisineBadgeText, { color: config.badgeColor }]}>{item.cuisineType}</Text>
            </View>
          </View>

          {/* Rating row */}
          <View style={styles.ratingRow}>
            <StarRating rating={item.rating} />
            <Text style={styles.ratingValue}>{item.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount})</Text>
          </View>

          {/* Influencer row */}
          <View style={styles.influencerRow}>
            <Text style={styles.influencerIcon}>{platformIcon}</Text>
            <Text style={styles.influencerText}>
              Reviewed by <Text style={styles.influencerName}>{item.influencerName}</Text>
            </Text>
          </View>

          {/* Location */}
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.city}, {item.state}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ---- Header component for FlatList ----
  const ListHeader = () => (
    <>
      {/* Trending Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEmoji}>🔥</Text>
        <Text style={styles.sectionTitle}>Trending Now</Text>
      </View>
      <FlatList
        data={trendingRestaurants}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `trending-${item.id}`}
        renderItem={renderTrendingCard}
        contentContainerStyle={styles.trendingList}
        snapToInterval={TRENDING_CARD_WIDTH + SPACING.md}
        decelerationRate="fast"
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or cuisine..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter toggle area */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* State filter */}
          <Text style={styles.filterLabel}>State</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
            <TouchableOpacity
              style={[styles.pill, !selectedState && styles.pillActive]}
              onPress={() => setSelectedState(null)}
            >
              <Text style={[styles.pillText, !selectedState && styles.pillTextActive]}>All</Text>
            </TouchableOpacity>
            {STATES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.pill, selectedState === s && styles.pillActive]}
                onPress={() => setSelectedState(selectedState === s ? null : s)}
              >
                <Text style={[styles.pillText, selectedState === s && styles.pillTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Cuisine filter */}
          <Text style={styles.filterLabel}>Cuisine</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
            <TouchableOpacity
              style={[styles.pill, !selectedCuisine && styles.pillActive]}
              onPress={() => setSelectedCuisine(null)}
            >
              <Text style={[styles.pillText, !selectedCuisine && styles.pillTextActive]}>All</Text>
            </TouchableOpacity>
            {ALL_CUISINES.map((c) => {
              const cfg = CUISINE_CONFIG[c];
              return (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.pill,
                    selectedCuisine === c && { backgroundColor: cfg.badgeColor, borderColor: cfg.badgeColor },
                  ]}
                  onPress={() => setSelectedCuisine(selectedCuisine === c ? null : c)}
                >
                  <Text style={[styles.pillText, selectedCuisine === c && styles.pillTextActive]}>
                    {cfg.emoji} {c}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Price filter */}
          <Text style={styles.filterLabel}>Budget</Text>
          <View style={styles.priceRow}>
            <TouchableOpacity
              style={[styles.pricePill, !selectedPrice && styles.pricePillActive]}
              onPress={() => setSelectedPrice(null)}
            >
              <Text style={[styles.pillText, !selectedPrice && styles.pillTextActive]}>All</Text>
            </TouchableOpacity>
            {PRICE_OPTIONS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.pricePill, selectedPrice === p && styles.pricePillActive]}
                onPress={() => setSelectedPrice(selectedPrice === p ? null : p)}
              >
                <Text style={[styles.pillText, selectedPrice === p && styles.pillTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* All Restaurants header */}
      <View style={styles.allRestaurantsHeader}>
        <View>
          <Text style={styles.sectionTitle}>All Restaurants</Text>
          <Text style={styles.resultCount}>{filteredRestaurants.length} spots found</Text>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.screenTitle}>LocalEats</Text>
          <Text style={styles.screenSubtitle}>Influencer-reviewed restaurants 🍴</Text>
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, showFilters && styles.filterBtnActive]}
          onPress={() => setShowFilters((prev) => !prev)}
        >
          <Ionicons name="options-outline" size={22} color={showFilters ? COLORS.textInverse : COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Restaurant list */}
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={renderRestaurantCard}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>No restaurants found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters or search query</Text>
          </View>
        }
      />
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

  // -- Top bar --
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  screenTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
  },
  screenSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
  },

  // -- List --
  listContent: {
    paddingBottom: 100,
  },

  // -- Trending --
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionEmoji: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  trendingList: {
    paddingLeft: SPACING.xl,
    paddingRight: SPACING.md,
  },
  trendingCard: {
    width: TRENDING_CARD_WIDTH,
    marginRight: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  trendingPhoto: {
    width: '100%',
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingEmoji: {
    fontSize: 42,
  },
  trendingBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(255,67,87,0.9)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  trendingBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#fff',
  },
  trendingInfo: {
    padding: SPACING.md,
  },
  trendingName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  // -- Cuisine badge --
  cuisineBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.round,
  },
  cuisineBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },

  // -- Search --
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },

  // -- Filters --
  filtersContainer: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  pillRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: FONT_WEIGHTS.bold,
  },
  priceRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  pricePill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pricePillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  // -- All restaurants header --
  allRestaurantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  resultCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // -- Restaurant card --
  restaurantCard: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.card,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  coverPhoto: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverEmoji: {
    fontSize: 56,
    opacity: 0.85,
  },
  dealBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    ...SHADOWS.sm,
  },
  dealBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#fff',
  },
  priceTag: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  priceText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.warning,
  },

  // -- Card info --
  cardInfo: {
    padding: SPACING.lg,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cardName: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  ratingValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.starFilled,
    marginLeft: SPACING.xs,
  },
  reviewCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
  },
  influencerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  influencerIcon: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  influencerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  influencerName: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  locationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
    flex: 1,
  },

  // -- Empty state --
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.huge,
    paddingHorizontal: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
