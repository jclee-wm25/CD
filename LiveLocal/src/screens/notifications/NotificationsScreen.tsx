import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import NotificationItem from '../../components/NotificationItem';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../../theme';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { getNotificationsForUser, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  const userNotifications = user ? getNotificationsForUser(user.id) : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </Text>
        </View>
        {userNotifications.length > 0 && unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={() => user && markAllAsRead(user.id)}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {userNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="notifications-off-outline" size={44} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySubtitle}>
              We will notify you about approved spots, new discounts nearby, and trending places.
            </Text>
          </View>
        ) : (
          userNotifications.map((item) => (
            <NotificationItem
              key={item.id}
              notification={item}
              onPress={() => markAsRead(item.id)}
            />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  markAllButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  markAllText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
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
    width: 80,
    height: 80,
    borderRadius: 40,
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
    lineHeight: 22,
  },
});
