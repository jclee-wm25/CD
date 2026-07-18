import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSaved } from '../../contexts/SavedContext';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_SPOTS } from '../../data/spots';
import { MOCK_RESTAURANTS } from '../../data/restaurants';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../../theme';

export default function SavedPlacesScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { savedPlaces, removeSaved } = useSaved();

  const userSavedPlaces = user ? savedPlaces.filter((s) => s.userId === user.id) : savedPlaces;

  const handleRemove = (targetId: string, name: string) => {
    Alert.alert('Remove Bookmark', `Remove "${name}" from your saved places?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeSaved(targetId) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Places</Text>
        <Text style={styles.headerSubtitle}>
          {userSavedPlaces.length} {userSavedPlaces.length === 1 ? 'place' : 'places'} bookmarked
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {userSavedPlaces.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="bookmark-outline" size={48} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No saved places yet</Text>
            <Text style={styles.emptySubtitle}>
              Explore local spots and restaurants, and tap the heart icon to bookmark your favorites!
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Discover')}
            >
              <Text style={styles.exploreButtonText}>Start Exploring</Text>
            </TouchableOpacity>
          </View>
        ) : (
          userSavedPlaces.map((item) => {
            if (item.targetType === 'spot') {
              const spot = MOCK_SPOTS.find((s) => s.id === item.targetId);
              if (!spot) return null;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('DiscoverTab', { screen: 'SpotDetail', params: { spotId: spot.id } })}
                >
                  <View style={styles.cardIconBox}>
                    <Text style={styles.cardEmoji}>🏛️</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.badgeRow}>
                      <View style={[styles.typeBadge, { backgroundColor: COLORS.secondary }]}>
                        <Text style={styles.typeBadgeText}>Spot</Text>
                      </View>
                      <Text style={styles.categoryText}>{spot.category}</Text>
                    </View>
                    <Text style={styles.itemTitle} numberOfLines={1}>{spot.name}</Text>
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                      <Text style={styles.locationText}>{spot.city}, {spot.state}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemove(spot.id, spot.name)}
                  >
                    <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            } else {
              const rest = MOCK_RESTAURANTS.find((r) => r.id === item.targetId);
              if (!rest) return null;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('LocalEatsTab', { screen: 'RestaurantDetail', params: { restaurantId: rest.id } })}
                >
                  <View style={[styles.cardIconBox, { backgroundColor: 'rgba(255, 107, 53, 0.15)' }]}>
                    <Text style={styles.cardEmoji}>🍜</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.badgeRow}>
                      <View style={[styles.typeBadge, { backgroundColor: COLORS.primary }]}>
                        <Text style={styles.typeBadgeText}>LocalEats</Text>
                      </View>
                      <Text style={styles.categoryText}>{rest.cuisineType}</Text>
                    </View>
                    <Text style={styles.itemTitle} numberOfLines={1}>{rest.name}</Text>
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                      <Text style={styles.locationText}>{rest.city}, {rest.state}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemove(rest.id, rest.name)}
                  >
                    <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            }
          })
        )}

        {/* View Itinerary Button */}
        {userSavedPlaces.length > 0 && (
          <TouchableOpacity
            style={styles.itineraryButton}
            onPress={() => navigation.navigate('Itinerary')}
            activeOpacity={0.85}
          >
            <Ionicons name="map-outline" size={20} color="#FFF" style={styles.itineraryIcon} />
            <Text style={styles.itineraryButtonText}>View as Day Itinerary</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  scrollContainer: {
    padding: SPACING.xl,
    paddingBottom: SPACING.huge,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.huge,
  },
  emptyIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.card,
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
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xxl,
    lineHeight: 22,
  },
  exploreButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardIconBox: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(0, 180, 216, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  cardEmoji: {
    fontSize: 26,
  },
  cardContent: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  typeBadgeText: {
    color: '#FFF',
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
  },
  itemTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  removeButton: {
    padding: SPACING.sm,
  },
  itineraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.lg,
    ...SHADOWS.md,
  },
  itineraryIcon: {
    marginRight: SPACING.sm,
  },
  itineraryButtonText: {
    color: '#FFF',
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
});
