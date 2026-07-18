import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MOCK_SPOTS } from '../../data/spots';
import { MOCK_RESTAURANTS } from '../../data/restaurants';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../../theme';

export default function AdminDashboardScreen() {
  const navigation = useNavigation<any>();

  const pendingSpotsCount = MOCK_SPOTS.filter((s) => s.status === 'pending').length;
  const approvedSpotsCount = MOCK_SPOTS.filter((s) => s.status === 'approved').length;
  const totalRestaurantsCount = MOCK_RESTAURANTS.length;
  const flaggedReviewsCount = 1; // mock count

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header Banner */}
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerBanner}
        >
          <View style={styles.bannerHeaderRow}>
            <View>
              <Text style={styles.bannerTitle}>Admin Dashboard</Text>
              <Text style={styles.bannerSubtitle}>LiveLocal Management & Moderation</Text>
            </View>
            <View style={styles.badgeCircle}>
              <Ionicons name="shield" size={28} color="#FFF" />
            </View>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <Text style={styles.sectionHeader}>PLATFORM OVERVIEW</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(0, 196, 140, 0.15)' }]}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
            </View>
            <Text style={styles.statNumber}>{approvedSpotsCount}</Text>
            <Text style={styles.statLabel}>Active Spots</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(0, 180, 216, 0.15)' }]}>
              <Ionicons name="restaurant" size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.statNumber}>{totalRestaurantsCount}</Text>
            <Text style={styles.statLabel}>LocalEats</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(255, 184, 0, 0.15)' }]}>
              <Ionicons name="time" size={24} color={COLORS.warning} />
            </View>
            <Text style={[styles.statNumber, { color: COLORS.warning }]}>{pendingSpotsCount}</Text>
            <Text style={styles.statLabel}>Pending Spots</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(255, 71, 87, 0.15)' }]}>
              <Ionicons name="flag" size={24} color={COLORS.error} />
            </View>
            <Text style={[styles.statNumber, { color: COLORS.error }]}>{flaggedReviewsCount}</Text>
            <Text style={styles.statLabel}>Flagged Reviews</Text>
          </View>
        </View>

        {/* Action Menu */}
        <Text style={styles.sectionHeader}>MODERATION QUEUES</Text>

        <TouchableOpacity
          style={styles.menuCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('PendingSpots')}
        >
          <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(255, 184, 0, 0.15)' }]}>
            <Ionicons name="location-outline" size={24} color={COLORS.warning} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Pending Spot Submissions</Text>
            <Text style={styles.menuSubtitle}>Approve or reject community spot entries</Text>
          </View>
          {pendingSpotsCount > 0 && (
            <View style={[styles.menuBadge, { backgroundColor: COLORS.warning }]}>
              <Text style={styles.menuBadgeText}>{pendingSpotsCount}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('FlaggedReviews')}
        >
          <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(255, 71, 87, 0.15)' }]}>
            <Ionicons name="flag-outline" size={24} color={COLORS.error} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Flagged Community Reviews</Text>
            <Text style={styles.menuSubtitle}>Evaluate reported comments or ratings</Text>
          </View>
          {flaggedReviewsCount > 0 && (
            <View style={[styles.menuBadge, { backgroundColor: COLORS.error }]}>
              <Text style={styles.menuBadgeText}>{flaggedReviewsCount}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: SPACING.xl,
    paddingBottom: SPACING.huge,
  },
  headerBanner: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    marginBottom: SPACING.xxl,
    ...SHADOWS.glow,
  },
  bannerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFF',
  },
  bannerSubtitle: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
  },
  badgeCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statNumber: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  menuIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  menuSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  menuBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
  },
  menuBadgeText: {
    color: '#FFF',
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
  },
});
