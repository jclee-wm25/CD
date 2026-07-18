// ============================================
// LiveLocal - Neighbourhood Explorer Screen
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
import { MOCK_GUIDES } from '../../data/guides';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CARD_GRADIENTS: [string, string][] = [
  [COLORS.gradientStart, COLORS.gradientEnd],
  [COLORS.gradientBlueStart, COLORS.gradientBlueEnd],
  ['#6C5CE7', '#A29BFE'],
  [COLORS.success, '#00E6A0'],
];

export default function ExplorerScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Explore Neighbourhoods</Text>
          <Text style={styles.headerSubtitle}>
            Walk the streets like a local
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{MOCK_GUIDES.length}</Text>
          <Text style={styles.headerBadgeLabel}>Guides</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_GUIDES.map((guide, index) => {
          const gradientColors = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

          return (
            <TouchableOpacity
              key={guide.id}
              style={styles.card}
              onPress={() => navigation.navigate('GuideDetail', { guideId: guide.id })}
              activeOpacity={0.85}
            >
              {/* Cover photo area with gradient */}
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardCover}
              >
                <Text style={styles.coverEmoji}>🗺️</Text>
                <View style={styles.coverOverlay}>
                  <View style={styles.coverBadge}>
                    <Ionicons name="walk-outline" size={14} color={COLORS.textPrimary} />
                    <Text style={styles.coverBadgeText}>Walking Guide</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Card info */}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {guide.title}
                </Text>

                <View style={styles.cardLocation}>
                  <Ionicons name="location" size={14} color={COLORS.primary} />
                  <Text style={styles.cardLocationText}>
                    {guide.city}, {guide.state}
                  </Text>
                </View>

                <View style={styles.cardStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statEmoji}>📍</Text>
                    <Text style={styles.statText}>
                      {guide.stops.length} stop{guide.stops.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statEmoji}>⏱️</Text>
                    <Text style={styles.statText}>{guide.estimatedDuration}</Text>
                  </View>
                </View>

                {/* Preview intro */}
                <Text style={styles.introPreview} numberOfLines={2}>
                  {guide.introduction}
                </Text>

                {/* Explore button */}
                <View style={styles.exploreRow}>
                  <Text style={styles.exploreText}>Explore guide</Text>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={22}
                    color={COLORS.primary}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  headerBadge: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  headerBadgeText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  headerBadgeLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.huge,
    gap: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  cardCover: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  coverEmoji: {
    fontSize: 64,
    opacity: 0.4,
  },
  coverOverlay: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
  },
  coverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  coverBadgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textPrimary,
  },
  cardContent: {
    padding: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  cardLocationText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  statEmoji: {
    fontSize: 16,
  },
  statText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
  },
  introPreview: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  exploreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
  exploreText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
  },
});
