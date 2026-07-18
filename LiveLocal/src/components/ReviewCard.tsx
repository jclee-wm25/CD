// ============================================
// LiveLocal - Review Card Component
// ============================================
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme';
import { Review } from '../types';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
  onFlag?: (reviewId: string) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onFlag }) => {
  return (
    <View style={[styles.card, SHADOWS.sm]}>
      {/* Header: name + flag */}
      <View style={styles.headerRow}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {review.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.userName}>{review.userName}</Text>
            <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
          </View>
        </View>

        {onFlag && (
          <TouchableOpacity
            onPress={() => onFlag(review.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.6}
          >
            <Ionicons
              name={review.isFlagged ? 'flag' : 'flag-outline'}
              size={18}
              color={review.isFlagged ? COLORS.error : COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Star Rating */}
      <View style={styles.ratingRow}>
        <StarRating rating={review.starRating} size={15} />
      </View>

      {/* Review Text */}
      <Text style={styles.reviewText}>{review.reviewText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  avatarLetter: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  headerText: {
    flex: 1,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  date: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  ratingRow: {
    marginBottom: SPACING.sm,
  },
  reviewText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    lineHeight: 20,
  },
});

export default ReviewCard;
