// ============================================
// LiveLocal - Guide Detail Screen
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../../theme';
import { RootStackParamList } from '../../types';
import { MOCK_GUIDES } from '../../data/guides';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'GuideDetail'>;

export default function GuideDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { guideId } = route.params;

  const guide = MOCK_GUIDES.find((g) => g.id === guideId);

  if (!guide) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Guide not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.errorLink}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero area */}
        <LinearGradient
          colors={[COLORS.gradientBlueStart, COLORS.gradientBlueEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.heroEmoji}>🗺️</Text>
          <Text style={styles.heroTitle}>{guide.title}</Text>
          <View style={styles.heroLocation}>
            <Ionicons name="location" size={16} color="rgba(255,255,255,0.85)" />
            <Text style={styles.heroLocationText}>
              {guide.city}, {guide.state}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Info bar */}
          <View style={styles.infoBar}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoValue}>{guide.estimatedDuration}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="footsteps-outline" size={20} color={COLORS.accent} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Stops</Text>
                <Text style={styles.infoValue}>
                  {guide.stops.length} place{guide.stops.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this Walk</Text>
            <Text style={styles.introText}>{guide.introduction}</Text>
          </View>

          {/* Walking Route */}
          <View style={styles.section}>
            <View style={styles.routeHeader}>
              <Text style={styles.sectionTitle}>Walking Route</Text>
              <View style={styles.routeBadge}>
                <Ionicons name="walk" size={14} color={COLORS.primary} />
                <Text style={styles.routeBadgeText}>
                  {guide.stops.length} stops
                </Text>
              </View>
            </View>

            {guide.stops.map((stop, index) => (
              <View key={stop.id} style={styles.stopContainer}>
                {/* Timeline */}
                <View style={styles.stopTimeline}>
                  <LinearGradient
                    colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                    style={styles.stopNumber}
                  >
                    <Text style={styles.stopNumberText}>{index + 1}</Text>
                  </LinearGradient>
                  {index < guide.stops.length - 1 && (
                    <View style={styles.stopLine} />
                  )}
                </View>

                {/* Stop content */}
                <View style={styles.stopCard}>
                  <View style={styles.stopCardHeader}>
                    <Text style={styles.stopName}>{stop.name}</Text>
                    <View style={styles.stopTimeTag}>
                      <Ionicons
                        name="time-outline"
                        size={12}
                        color={COLORS.accent}
                      />
                      <Text style={styles.stopTimeText}>{stop.estimatedTime}</Text>
                    </View>
                  </View>

                  <Text style={styles.stopDescription}>{stop.description}</Text>

                  {/* Local Tip */}
                  <View style={styles.tipBox}>
                    <View style={styles.tipHeader}>
                      <Text style={styles.tipIcon}>💡</Text>
                      <Text style={styles.tipLabel}>Local Tip</Text>
                    </View>
                    <Text style={styles.tipText}>{stop.localTip}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  errorLink: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  hero: {
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: SPACING.md,
    opacity: 0.8,
  },
  heroTitle: {
    fontSize: FONT_SIZES.huge,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  heroLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  heroLocationText: {
    fontSize: FONT_SIZES.lg,
    color: 'rgba(255,255,255,0.85)',
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.huge,
  },
  infoBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xxl,
    ...SHADOWS.md,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  infoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  infoDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  introText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: `${COLORS.primary}20`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  routeBadgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
  },
  stopContainer: {
    flexDirection: 'row',
  },
  stopTimeline: {
    width: 40,
    alignItems: 'center',
  },
  stopNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  stopNumberText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  stopLine: {
    width: 2,
    flex: 1,
    backgroundColor: `${COLORS.primary}40`,
    marginVertical: 4,
  },
  stopCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginLeft: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  stopCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  stopName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  stopTimeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: `${COLORS.accent}20`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  stopTimeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.accent,
  },
  stopDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  tipBox: {
    backgroundColor: `${COLORS.warning}15`,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tipIcon: {
    fontSize: 14,
  },
  tipLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.warning,
  },
  tipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
