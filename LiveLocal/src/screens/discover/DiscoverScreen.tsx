// ============================================
// LiveLocal - Discover Screen
// ============================================
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import {
  Spot,
  SpotCategory,
  MalaysianState,
  PriceRange,
  RootStackParamList,
} from '../../types';
import { MOCK_SPOTS } from '../../data/spots';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ---- Category helpers ----
const CATEGORY_CONFIG: Record<SpotCategory, { emoji: string; gradient: [string, string]; color: string }> = {
  Kopitiam:     { emoji: '☕', gradient: ['#5D4037', '#795548'], color: '#795548' },
  'Hawker Stall': { emoji: '🍜', gradient: ['#E65100', '#FF8F00'], color: '#FF8F00' },
  'Night Market': { emoji: '🏮', gradient: ['#880E4F', '#AD1457'], color: '#AD1457' },
  Park:         { emoji: '🌿', gradient: ['#1B5E20', '#388E3C'], color: '#388E3C' },
  Cafe:         { emoji: '🧁', gradient: ['#4E342E', '#6D4C41'], color: '#6D4C41' },
  Temple:       { emoji: '🛕', gradient: ['#BF360C', '#E64A19'], color: '#E64A19' },
  'Street Art': { emoji: '🎨', gradient: ['#4A148C', '#7B1FA2'], color: '#7B1FA2' },
  Beach:        { emoji: '🏖️', gradient: ['#01579B', '#0288D1'], color: '#0288D1' },
  Market:       { emoji: '🛒', gradient: ['#F57F17', '#FBC02D'], color: '#FBC02D' },
  Heritage:     { emoji: '🏛️', gradient: ['#3E2723', '#5D4037'], color: '#5D4037' },
};

const ALL_CATEGORIES: SpotCategory[] = [
  'Kopitiam', 'Hawker Stall', 'Night Market', 'Park', 'Cafe',
  'Temple', 'Street Art', 'Beach', 'Market', 'Heritage',
];

const ALL_STATES: MalaysianState[] = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang',
  'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor',
  'Terengganu', 'Kuala Lumpur', 'Putrajaya', 'Labuan',
];

const ALL_PRICES: PriceRange[] = ['$', '$$', '$$$'];

// ---- Rating stars ----
function RatingStars({ rating, size = 14 }: { rating: number; size?: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text
        key={i}
        style={{
          fontSize: size,
          color: i <= Math.round(rating) ? COLORS.starFilled : COLORS.starEmpty,
          marginRight: 1,
        }}
      >
        ★
      </Text>
    );
  }
  return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{stars}</View>;
}

// ---- Spot card ----
function SpotCard({ spot, onPress }: { spot: Spot; onPress: () => void }) {
  const config = CATEGORY_CONFIG[spot.category];
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      {/* Photo area */}
      <LinearGradient
        colors={config.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardPhoto}
      >
        <Text style={styles.cardEmoji}>{config.emoji}</Text>
      </LinearGradient>

      {/* Content */}
      <View style={styles.cardContent}>
        {/* Category badge */}
        <View style={[styles.categoryBadge, { backgroundColor: config.color + '30' }]}>
          <Text style={[styles.categoryBadgeText, { color: config.color }]}>
            {spot.category}
          </Text>
        </View>

        <Text style={styles.cardName} numberOfLines={1}>
          {spot.name}
        </Text>

        <View style={styles.cardLocationRow}>
          <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} />
          <Text style={styles.cardLocation} numberOfLines={1}>
            {spot.city}, {spot.state}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <RatingStars rating={spot.rating} />
          <Text style={styles.cardReviewCount}>({spot.reviewCount})</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.cardPrice}>{spot.priceRange}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ---- Main screen ----
export default function DiscoverScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedState, setSelectedState] = useState<MalaysianState | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<SpotCategory[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<PriceRange | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (selectedState) c++;
    if (selectedCategories.length > 0) c++;
    if (selectedPrice) c++;
    return c;
  }, [selectedState, selectedCategories, selectedPrice]);

  // Filter spots
  const filteredSpots = useMemo(() => {
    return MOCK_SPOTS.filter((s) => {
      if (s.status !== 'approved') return false;
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.category.toLowerCase().includes(q) &&
          !s.city.toLowerCase().includes(q) &&
          !s.state.toLowerCase().includes(q)
        )
          return false;
      }
      // State
      if (selectedState && s.state !== selectedState) return false;
      // Category
      if (selectedCategories.length > 0 && !selectedCategories.includes(s.category))
        return false;
      // Price
      if (selectedPrice && s.priceRange !== selectedPrice) return false;
      return true;
    });
  }, [searchQuery, selectedState, selectedCategories, selectedPrice]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  // Category toggle
  const toggleCategory = (cat: SpotCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedState(null);
    setSelectedCategories([]);
    setSelectedPrice(null);
  };

  // ---- Render ----
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>Find hidden local gems</Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={22} color={COLORS.textPrimary} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search spots, categories, cities..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Active filter pills */}
      {activeFilterCount > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activeFiltersRow}
        >
          {selectedState && (
            <TouchableOpacity
              style={styles.activeFilterPill}
              onPress={() => setSelectedState(null)}
            >
              <Text style={styles.activeFilterText}>{selectedState}</Text>
              <Ionicons name="close" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          {selectedCategories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={styles.activeFilterPill}
              onPress={() => toggleCategory(cat)}
            >
              <Text style={styles.activeFilterText}>{cat}</Text>
              <Ionicons name="close" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          ))}
          {selectedPrice && (
            <TouchableOpacity
              style={styles.activeFilterPill}
              onPress={() => setSelectedPrice(null)}
            >
              <Text style={styles.activeFilterText}>{selectedPrice}</Text>
              <Ionicons name="close" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.clearAllButton} onPress={clearFilters}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Spot list */}
      <FlatList
        data={filteredSpots}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        renderItem={({ item }) => (
          <SpotCard
            spot={item}
            onPress={() => navigation.navigate('SpotDetail', { spotId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <LinearGradient
              colors={[COLORS.surface, COLORS.card]}
              style={styles.emptyIcon}
            >
              <Ionicons name="compass-outline" size={48} color={COLORS.textMuted} />
            </LinearGradient>
            <Text style={styles.emptyTitle}>No spots found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filters
            </Text>
            {activeFilterCount > 0 && (
              <TouchableOpacity style={styles.emptyButton} onPress={clearFilters}>
                <Text style={styles.emptyButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('SubmitSpot')}
      >
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Filter modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* State selector */}
              <Text style={styles.filterSectionTitle}>State</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterPillsRow}
              >
                <TouchableOpacity
                  style={[
                    styles.statePill,
                    !selectedState && styles.statePillActive,
                  ]}
                  onPress={() => setSelectedState(null)}
                >
                  <Text
                    style={[
                      styles.statePillText,
                      !selectedState && styles.statePillTextActive,
                    ]}
                  >
                    All States
                  </Text>
                </TouchableOpacity>
                {ALL_STATES.map((st) => (
                  <TouchableOpacity
                    key={st}
                    style={[
                      styles.statePill,
                      selectedState === st && styles.statePillActive,
                    ]}
                    onPress={() =>
                      setSelectedState((prev) => (prev === st ? null : st))
                    }
                  >
                    <Text
                      style={[
                        styles.statePillText,
                        selectedState === st && styles.statePillTextActive,
                      ]}
                    >
                      {st}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Category selector */}
              <Text style={styles.filterSectionTitle}>Category</Text>
              <View style={styles.categoryGrid}>
                {ALL_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  const cfg = CATEGORY_CONFIG[cat];
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryPill,
                        isSelected && { backgroundColor: cfg.color + '30', borderColor: cfg.color },
                      ]}
                      onPress={() => toggleCategory(cat)}
                    >
                      <Text style={{ fontSize: 16, marginRight: 4 }}>{cfg.emoji}</Text>
                      <Text
                        style={[
                          styles.categoryPillText,
                          isSelected && { color: cfg.color },
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Price range */}
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceRow}>
                {ALL_PRICES.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.pricePill,
                      selectedPrice === p && styles.pricePillActive,
                    ]}
                    onPress={() =>
                      setSelectedPrice((prev) => (prev === p ? null : p))
                    }
                  >
                    <Text
                      style={[
                        styles.pricePillText,
                        selectedPrice === p && styles.pricePillTextActive,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Modal footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilterModal(false)}
              >
                <LinearGradient
                  colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                  style={styles.applyGradient}
                >
                  <Text style={styles.applyButtonText}>
                    Show {filteredSpots.length} Results
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFF',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },

  // Active filter pills
  activeFiltersRow: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  activeFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '18',
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  activeFilterText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.medium,
    marginRight: 4,
  },
  clearAllButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    justifyContent: 'center',
  },
  clearAllText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    fontWeight: FONT_WEIGHTS.semibold,
  },

  // List
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
    paddingTop: SPACING.sm,
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  cardPhoto: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 56,
  },
  cardContent: {
    padding: SPACING.lg,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  categoryBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cardLocation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardReviewCount: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  cardPrice: {
    fontSize: FONT_SIZES.md,
    color: COLORS.success,
    fontWeight: FONT_WEIGHTS.bold,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SPACING.xxl,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  emptyButtonText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: FONT_SIZES.md,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: SPACING.xl,
    bottom: SPACING.xxl,
    ...SHADOWS.glow,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    paddingTop: SPACING.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },

  // Filter sections
  filterSectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterPillsRow: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  statePill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statePillActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  statePillText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  statePillTextActive: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },

  // Category grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryPillText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },

  // Price
  priceRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  pricePill: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pricePillActive: {
    backgroundColor: COLORS.success + '20',
    borderColor: COLORS.success,
  },
  pricePillText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  pricePillTextActive: {
    color: COLORS.success,
  },

  // Modal footer
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.xl,
  },
  clearButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  applyButton: {
    flex: 2,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  applyGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  applyButtonText: {
    fontSize: FONT_SIZES.md,
    color: '#FFF',
    fontWeight: FONT_WEIGHTS.bold,
  },
});
