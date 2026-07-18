// ============================================
// LiveLocal - Itinerary Screen
// ============================================
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../../theme';
import { RootStackParamList } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useSaved } from '../../contexts/SavedContext';
import { MOCK_SPOTS } from '../../data/spots';
import { MOCK_RESTAURANTS } from '../../data/restaurants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ItineraryPlace {
  id: string;
  name: string;
  category: string;
  address: string;
  state: string;
  city: string;
  type: 'spot' | 'restaurant';
}

interface DayGroup {
  state: string;
  places: ItineraryPlace[];
}

export default function ItineraryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { getSavedByUser } = useSaved();

  const userId = user?.id ?? '';
  const savedPlaces = getSavedByUser(userId);

  // Resolve saved items to place details
  const places: ItineraryPlace[] = savedPlaces
    .map((sp) => {
      if (sp.targetType === 'spot') {
        const spot = MOCK_SPOTS.find((s) => s.id === sp.targetId);
        if (!spot) return null;
        return {
          id: spot.id,
          name: spot.name,
          category: spot.category,
          address: spot.address,
          state: spot.state,
          city: spot.city,
          type: 'spot' as const,
        };
      } else {
        const rest = MOCK_RESTAURANTS.find((r) => r.id === sp.targetId);
        if (!rest) return null;
        return {
          id: rest.id,
          name: rest.name,
          category: rest.cuisineType,
          address: rest.address,
          state: rest.state,
          city: rest.city,
          type: 'restaurant' as const,
        };
      }
    })
    .filter(Boolean) as ItineraryPlace[];

  // Group by state for "days"
  const groupedByState: DayGroup[] = [];
  const stateMap = new Map<string, ItineraryPlace[]>();
  places.forEach((place) => {
    const existing = stateMap.get(place.state);
    if (existing) {
      existing.push(place);
    } else {
      stateMap.set(place.state, [place]);
    }
  });
  stateMap.forEach((placesInState, state) => {
    groupedByState.push({ state, places: placesInState });
  });

  const DAY_COLORS = [
    [COLORS.gradientStart, COLORS.gradientEnd],
    [COLORS.gradientBlueStart, COLORS.gradientBlueEnd],
    ['#6C5CE7', '#A29BFE'],
    [COLORS.success, '#00E6A0'],
    [COLORS.warning, '#FFD54F'],
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Your Itinerary</Text>
          <Text style={styles.headerSubtitle}>
            {groupedByState.length} day{groupedByState.length !== 1 ? 's' : ''} •{' '}
            {places.length} stop{places.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {places.length < 2 ? (
        /* Prompt to save more */
        <View style={styles.promptContainer}>
          <View style={styles.promptIconWrap}>
            <Ionicons name="map-outline" size={56} color={COLORS.textMuted} />
          </View>
          <Text style={styles.promptTitle}>Almost there!</Text>
          <Text style={styles.promptMessage}>
            Save at least 2 places to generate your personalised itinerary. You currently
            have {places.length}.
          </Text>
          <TouchableOpacity
            style={styles.promptButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.promptButtonGradient}
            >
              <Ionicons name="add-circle-outline" size={20} color={COLORS.textPrimary} />
              <Text style={styles.promptButtonText}>Save More Places</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {groupedByState.map((group, dayIndex) => {
            const colors = DAY_COLORS[dayIndex % DAY_COLORS.length];
            return (
              <View key={group.state} style={styles.dayGroup}>
                {/* Day header */}
                <LinearGradient
                  colors={colors as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.dayHeader}
                >
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>{dayIndex + 1}</Text>
                  </View>
                  <View>
                    <Text style={styles.dayTitle}>Day {dayIndex + 1}</Text>
                    <Text style={styles.dayState}>{group.state}</Text>
                  </View>
                  <View style={styles.dayStopsInfo}>
                    <Text style={styles.dayStopsCount}>
                      {group.places.length} stop{group.places.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </LinearGradient>

                {/* Places list */}
                <View style={styles.placesContainer}>
                  {group.places.map((place, placeIndex) => (
                    <View key={place.id} style={styles.placeRow}>
                      {/* Timeline connector */}
                      <View style={styles.timeline}>
                        <View
                          style={[
                            styles.timelineDot,
                            { backgroundColor: colors[0] },
                          ]}
                        >
                          <Text style={styles.timelineDotText}>{placeIndex + 1}</Text>
                        </View>
                        {placeIndex < group.places.length - 1 && (
                          <View
                            style={[
                              styles.timelineLine,
                              { backgroundColor: `${colors[0]}40` },
                            ]}
                          />
                        )}
                      </View>

                      {/* Place card */}
                      <View style={styles.placeCard}>
                        <View style={styles.placeCardHeader}>
                          <Text style={styles.placeName} numberOfLines={1}>
                            {place.name}
                          </Text>
                          <View
                            style={[
                              styles.placeTypeBadge,
                              {
                                backgroundColor:
                                  place.type === 'spot'
                                    ? `${COLORS.accent}20`
                                    : `${COLORS.primary}20`,
                              },
                            ]}
                          >
                            <Ionicons
                              name={place.type === 'spot' ? 'compass' : 'restaurant'}
                              size={10}
                              color={
                                place.type === 'spot' ? COLORS.accent : COLORS.primary
                              }
                            />
                          </View>
                        </View>
                        <View style={styles.placeDetailRow}>
                          <Ionicons
                            name="pricetag-outline"
                            size={12}
                            color={COLORS.textMuted}
                          />
                          <Text style={styles.placeCategory}>{place.category}</Text>
                        </View>
                        <View style={styles.placeDetailRow}>
                          <Ionicons
                            name="location-outline"
                            size={12}
                            color={COLORS.textMuted}
                          />
                          <Text style={styles.placeAddress} numberOfLines={2}>
                            {place.address}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.huge,
  },
  dayGroup: {
    marginBottom: SPACING.xxl,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.md,
    ...SHADOWS.md,
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBadgeText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
  },
  dayTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  dayState: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  dayStopsInfo: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  dayStopsCount: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  placesContainer: {
    marginLeft: SPACING.xl,
    marginTop: SPACING.md,
  },
  placeRow: {
    flexDirection: 'row',
  },
  timeline: {
    width: 32,
    alignItems: 'center',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  timelineDotText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  placeCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginLeft: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  placeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  placeName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  placeTypeBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  placeCategory: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  placeAddress: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    flex: 1,
    lineHeight: 18,
  },
  promptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxxl,
  },
  promptIconWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  promptTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  promptMessage: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xxl,
  },
  promptButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.glow,
  },
  promptButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
  },
  promptButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
});
