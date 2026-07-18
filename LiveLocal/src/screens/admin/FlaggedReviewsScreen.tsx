import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../../theme';

interface MockFlaggedReview {
  id: string;
  reviewerName: string;
  targetName: string;
  targetType: 'spot' | 'restaurant';
  starRating: number;
  reviewText: string;
  flagReason: string;
  flaggedBy: string;
  date: string;
}

const INITIAL_FLAGGED: MockFlaggedReview[] = [
  {
    id: 'flag-001',
    reviewerName: 'John Doe',
    targetName: 'Indie Brew Café',
    targetType: 'spot',
    starRating: 1,
    reviewText: 'This place is terrible! Do not come here, waste of money and rude service!',
    flagReason: 'Inappropriate language and unverified claims per FR57.',
    flaggedBy: 'user-001',
    date: '2026-07-13',
  },
  {
    id: 'flag-002',
    reviewerName: 'SpamAccount99',
    targetName: 'Nasi Kandar Line Clear',
    targetType: 'restaurant',
    starRating: 5,
    reviewText: 'Check out my crypto telegram channel @cryptomy for guaranteed returns!!!',
    flagReason: 'Spam and promotional links violating community guidelines.',
    flaggedBy: 'user-002',
    date: '2026-07-14',
  },
];

export default function FlaggedReviewsScreen() {
  const [reviews, setReviews] = useState<MockFlaggedReview[]>(INITIAL_FLAGGED);

  const handleRemove = (review: MockFlaggedReview) => {
    Alert.alert(
      'Remove Review',
      `Permanently remove this review by ${review.reviewerName} per FR60?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove Permanent',
          style: 'destructive',
          onPress: () => {
            setReviews((prev) => prev.filter((r) => r.id !== review.id));
            Alert.alert('Removed ✅', 'Review deleted from LiveLocal and spot average rating recalculated.');
          },
        },
      ]
    );
  };

  const handleDismiss = (review: MockFlaggedReview) => {
    Alert.alert(
      'Dismiss Flag',
      'Keep this review and clear the moderation flag?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Dismiss Flag',
          style: 'default',
          onPress: () => {
            setReviews((prev) => prev.filter((r) => r.id !== review.id));
            Alert.alert('Dismissed', 'Review remains visible.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flagged Reviews</Text>
        <Text style={styles.headerSubtitle}>
          {reviews.length} {reviews.length === 1 ? 'review reported' : 'reviews reported'} by community
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {reviews.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="shield-checkmark-outline" size={48} color={COLORS.success} />
            </View>
            <Text style={styles.emptyTitle}>No Flagged Reviews</Text>
            <Text style={styles.emptySubtitle}>All reported community comments have been moderated.</Text>
          </View>
        ) : (
          reviews.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.flagBox}>
                <View style={styles.flagTitleRow}>
                  <Ionicons name="warning" size={18} color={COLORS.error} />
                  <Text style={styles.flagTitle}>Reported Reason (FR57):</Text>
                </View>
                <Text style={styles.flagReasonText}>{item.flagReason}</Text>
              </View>

              <View style={styles.targetRow}>
                <View style={[styles.targetBadge, { backgroundColor: item.targetType === 'spot' ? COLORS.secondary : COLORS.primary }]}>
                  <Text style={styles.targetBadgeText}>{item.targetType === 'spot' ? 'Spot' : 'LocalEats'}</Text>
                </View>
                <Text style={styles.targetNameText}>{item.targetName}</Text>
              </View>

              <View style={styles.reviewBox}>
                <View style={styles.reviewerRow}>
                  <Text style={styles.reviewerName}>{item.reviewerName}</Text>
                  <Text style={styles.reviewDate}>{item.date}</Text>
                </View>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= item.starRating ? 'star' : 'star-outline'}
                      size={14}
                      color={star <= item.starRating ? COLORS.starFilled : COLORS.starEmpty}
                      style={{ marginRight: 2 }}
                    />
                  ))}
                </View>
                <Text style={styles.reviewText}>"{item.reviewText}"</Text>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.dismissButton}
                  activeOpacity={0.8}
                  onPress={() => handleDismiss(item)}
                >
                  <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.textSecondary} />
                  <Text style={styles.dismissText}>Dismiss Flag</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeButton}
                  activeOpacity={0.8}
                  onPress={() => handleRemove(item)}
                >
                  <Ionicons name="trash-outline" size={18} color="#FFF" />
                  <Text style={styles.removeText}>Delete Review</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0, 196, 140, 0.15)',
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
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  flagBox: {
    backgroundColor: 'rgba(255, 71, 87, 0.12)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.error,
  },
  flagTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  flagTitle: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    marginLeft: SPACING.xs,
  },
  flagReasonText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  targetBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  targetBadgeText: {
    color: '#FFF',
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
  },
  targetNameText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  reviewBox: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  reviewerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  reviewDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  reviewText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dismissButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dismissText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    marginLeft: SPACING.xs,
  },
  removeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginLeft: SPACING.sm,
    ...SHADOWS.sm,
  },
  removeText: {
    color: '#FFF',
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    marginLeft: SPACING.xs,
  },
});
