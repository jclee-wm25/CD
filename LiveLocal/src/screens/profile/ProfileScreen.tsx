// ============================================
// LiveLocal - Profile Screen
// ============================================
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../contexts/AuthContext";
import { useSaved } from "../../contexts/SavedContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { RootStackParamList } from "../../types";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
} from "../../theme";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

// Helper to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Helper to get role badge config
function getRoleBadge(role: string) {
  switch (role) {
    case "admin":
      return {
        label: "Admin",
        color: COLORS.error,
        icon: "shield-checkmark" as const,
      };
    case "influencer":
      return {
        label: "Influencer",
        color: COLORS.accent,
        icon: "star" as const,
      };
    default:
      return {
        label: "Tourist",
        color: COLORS.success,
        icon: "airplane" as const,
      };
  }
}

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  onPress: () => void;
  badge?: number;
  color?: string;
  showChevron?: boolean;
  destructive?: boolean;
}

export default function ProfileScreen() {
  const navigation = useNavigation<NavProp>();
  const { user, logout } = useAuth();
  const { getSavedByUser } = useSaved();
  const { getNotificationsForUser } = useNotifications();

  if (!user) return null;

  const roleBadge = getRoleBadge(user.role);
  const savedCount = getSavedByUser(user.id).length;
  const userNotifications = getNotificationsForUser(user.id);
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive", 
        onPress: () => {
          logout();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" as any }],
          });
        }
      },
    ]);
  };

  const menuItems: MenuItem[] = [
    {
      icon: "create-outline",
      label: "Edit Profile",
      subtitle: "Update your information",
      onPress: () => navigation.navigate("EditProfile"),
      showChevron: true,
    },
    {
      icon: "notifications-outline",
      label: "Notifications",
      subtitle: unreadCount > 0 ? `${unreadCount} unread` : "All caught up",
      onPress: () => navigation.navigate("Notifications"),
      badge: unreadCount,
      showChevron: true,
    },
    ...(user.role === "admin"
      ? [
          {
            icon: "settings-outline" as keyof typeof Ionicons.glyphMap,
            label: "Admin Dashboard",
            subtitle: "Manage spots, reviews & users",
            onPress: () => navigation.navigate("AdminDashboard"),
            color: COLORS.warning,
            showChevron: true,
          },
        ]
      : []),
    {
      icon: "log-out-outline",
      label: "Logout",
      subtitle: "Sign out of your account",
      onPress: handleLogout,
      destructive: true,
    },
  ];

  const stats = [
    { label: "Saved", value: savedCount, icon: "bookmark" as const },
    { label: "Reviews", value: 0, icon: "chatbubble" as const },
    {
      label: "Joined",
      value: new Date(user.createdAt).getFullYear().toString(),
      icon: "calendar" as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={["rgba(255, 107, 53, 0.15)", "rgba(255, 107, 53, 0.02)"]}
            style={styles.headerGradient}
          >
            {/* Avatar */}
            <View style={styles.avatarSection}>
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarInitials}>
                  {getInitials(user.name)}
                </Text>
              </LinearGradient>

              {/* Role Badge */}
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: `${roleBadge.color}20` },
                ]}
              >
                <Ionicons
                  name={roleBadge.icon}
                  size={12}
                  color={roleBadge.color}
                />
                <Text
                  style={[styles.roleBadgeText, { color: roleBadge.color }]}
                >
                  {roleBadge.label}
                </Text>
              </View>
            </View>

            {/* User Info */}
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>

            {/* Influencer Status */}
            {user.role === "influencer" && user.influencerStatus && (
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      user.influencerStatus === "approved"
                        ? `${COLORS.success}20`
                        : user.influencerStatus === "pending"
                          ? `${COLORS.warning}20`
                          : `${COLORS.error}20`,
                  },
                ]}
              >
                <Ionicons
                  name={
                    user.influencerStatus === "approved"
                      ? "checkmark-circle"
                      : user.influencerStatus === "pending"
                        ? "time"
                        : "close-circle"
                  }
                  size={14}
                  color={
                    user.influencerStatus === "approved"
                      ? COLORS.success
                      : user.influencerStatus === "pending"
                        ? COLORS.warning
                        : COLORS.error
                  }
                />
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        user.influencerStatus === "approved"
                          ? COLORS.success
                          : user.influencerStatus === "pending"
                            ? COLORS.warning
                            : COLORS.error,
                    },
                  ]}
                >
                  {user.influencerStatus.charAt(0).toUpperCase() +
                    user.influencerStatus.slice(1)}
                </Text>
              </View>
            )}

            {/* Bio */}
            {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}

            {/* Location */}
            {user.location ? (
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={COLORS.textMuted}
                />
                <Text style={styles.locationText}>{user.location}</Text>
              </View>
            ) : null}

            {/* Social Media */}
            {user.socialMedia && (
              <View style={styles.socialRow}>
                {user.socialMedia.tiktok && (
                  <View style={styles.socialChip}>
                    <Ionicons
                      name="logo-tiktok"
                      size={14}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.socialChipText}>
                      {user.socialMedia.tiktok}
                    </Text>
                  </View>
                )}
                {user.socialMedia.instagram && (
                  <View style={styles.socialChip}>
                    <Ionicons
                      name="logo-instagram"
                      size={14}
                      color={COLORS.instagram}
                    />
                    <Text style={styles.socialChipText}>
                      {user.socialMedia.instagram}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Ionicons name={stat.icon} size={18} color={COLORS.primary} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={item.onPress}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  {
                    backgroundColor: item.destructive
                      ? `${COLORS.error}15`
                      : item.color
                        ? `${item.color}15`
                        : `${COLORS.primary}15`,
                  },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={
                    item.destructive
                      ? COLORS.error
                      : item.color || COLORS.primary
                  }
                />
              </View>

              <View style={styles.menuContent}>
                <Text
                  style={[
                    styles.menuLabel,
                    item.destructive && { color: COLORS.error },
                  ]}
                >
                  {item.label}
                </Text>
                {item.subtitle && (
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                )}
              </View>

              {item.badge && item.badge > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              ) : null}

              {item.showChevron && (
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={COLORS.textMuted}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>LiveLocal v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.huge,
  },

  // Header Card
  headerCard: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
    backgroundColor: COLORS.card,
    ...SHADOWS.md,
  },
  headerGradient: {
    padding: SPACING.xxl,
    alignItems: "center",
  },

  // Avatar
  avatarSection: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  avatarGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.glow,
  },
  avatarInitials: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },

  // Role Badge
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  roleBadgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // User Info
  userName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },

  // Influencer Status
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.round,
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },

  // Bio
  bio: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },

  // Location
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  locationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },

  // Social
  socialRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.md,
    justifyContent: "center",
  },
  socialChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.xs,
  },
  socialChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Menu
  menuSection: {
    marginTop: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: SPACING.md,
    marginLeft: SPACING.xs,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  menuSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  badge: {
    backgroundColor: COLORS.error,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xs + 2,
    marginRight: SPACING.sm,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },

  // Version
  versionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: SPACING.xxl,
  },
});
