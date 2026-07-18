// ============================================
// LiveLocal - Guide Card Component
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
import { NeighbourhoodGuide } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GuideCardProps {
  guide: NeighbourhoodGuide;
  onPress?: () => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, SHADOWS.md]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Cover Photo with Gradient Overlay */}
      <View style={styles.imageContainer}>
        {guide.coverPhoto ? (
          <Image source={{ uri: guide.coverPhoto }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="map-outline" size={44} color={COLORS.textMuted} />
          </View>
        )}
        <LinearGradient
          colors={['rgba(10,14,33,0.15)', 'rgba(10,14,33,0.92)']}
          style={styles.gradient}
        />

        {/* Content overlay */}
        <View style={styles.overlay}>
          <Text style={styles.title} numberOfLines={2}>
            {guide.title}
          </Text>

          {/* Location */}
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>
              {guide.city}, {guide.state}
            </Text>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="flag-outline" size={13} color={COLORS.primary} />
              <Text style={styles.statText}>
                {guide.stops.length} stop{guide.stops.length !== 1 ? 's' : ''}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
              <Ionicons name="time-outline" size={13} color={COLORS.primary} />
              <Text style={styles.statText}>{guide.estimatedDuration}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  imageContainer: {
    width: '100%',
    height: 200,
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
    ...StyleSheet.absoluteFill,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.sm,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
});

export default GuideCard;
