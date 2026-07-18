// ============================================
// LiveLocal - Notification Item Component
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
import { AppNotification, NotificationType } from '../types';

interface NotificationItemProps {
  notification: AppNotification;
  onPress?: () => void;
}

interface NotificationMeta {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const NOTIFICATION_META: Record<NotificationType, NotificationMeta> = {
  spot_approved: { icon: 'checkmark-circle', color: COLORS.success },
  spot_rejected: { icon: 'close-circle', color: COLORS.error },
  new_discount: { icon: 'pricetag', color: COLORS.warning },
  new_trending: { icon: 'trending-up', color: COLORS.accent },
  review_flagged: { icon: 'flag', color: COLORS.warning },
  review_removed: { icon: 'trash', color: COLORS.error },
  influencer_approved: { icon: 'person-circle', color: COLORS.success },
  influencer_rejected: { icon: 'person-remove', color: COLORS.error },
};

const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-MY', { month: 'short', day: 'numeric' });
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
  const meta = NOTIFICATION_META[notification.type];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !notification.isRead && styles.unreadContainer,
        SHADOWS.sm,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: `${meta.color}20` }]}>
        <Ionicons name={meta.icon} size={22} color={meta.color} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              !notification.isRead && styles.unreadTitle,
            ]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text style={styles.time}>{getTimeAgo(notification.createdAt)}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
      </View>

      {/* Unread dot */}
      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  unreadContainer: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  title: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    flex: 1,
    marginRight: SPACING.sm,
  },
  unreadTitle: {
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  time: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
  },
  message: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.sm,
  },
});

export default NotificationItem;
