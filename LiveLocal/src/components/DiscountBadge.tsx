// ============================================
// LiveLocal - Discount Badge Component
// ============================================
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme';
import { DiscountCode } from '../types';

interface DiscountBadgeProps {
  discountCode: DiscountCode;
}

const formatExpiry = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const DiscountBadge: React.FC<DiscountBadgeProps> = ({ discountCode }) => {
  const handleCopy = () => {
    // In a real app, use expo-clipboard. For now, show an alert.
    Alert.alert(
      'Code Copied!',
      `Discount code "${discountCode.code}" has been copied to your clipboard.`,
      [{ text: 'OK' }],
    );
  };

  return (
    <LinearGradient
      colors={['#FF8B5E', '#FFB800']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, SHADOWS.glow]}
    >
      {/* Header row with tag icon */}
      <View style={styles.headerRow}>
        <Ionicons name="pricetag" size={16} color={COLORS.textInverse} />
        <Text style={styles.label}>DISCOUNT CODE</Text>
      </View>

      {/* Code + Copy button */}
      <TouchableOpacity
        style={styles.codeRow}
        onPress={handleCopy}
        activeOpacity={0.8}
      >
        <Text style={styles.code}>{discountCode.code}</Text>
        <View style={styles.copyButton}>
          <Ionicons name="copy-outline" size={16} color={COLORS.primary} />
        </View>
      </TouchableOpacity>

      {/* Description */}
      <Text style={styles.description}>{discountCode.description}</Text>

      {/* Expiry */}
      <View style={styles.expiryRow}>
        <Ionicons name="calendar-outline" size={12} color="rgba(10,14,33,0.6)" />
        <Text style={styles.expiry}>
          Expires {formatExpiry(discountCode.expiryDate)}
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  label: {
    color: COLORS.textInverse,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.extrabold,
    letterSpacing: 1.2,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  code: {
    color: COLORS.textInverse,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.extrabold,
    letterSpacing: 2,
  },
  copyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,107,53,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    color: 'rgba(10,14,33,0.8)',
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.sm,
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  expiry: {
    color: 'rgba(10,14,33,0.6)',
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
  },
});

export default DiscountBadge;
