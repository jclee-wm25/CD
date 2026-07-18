import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spot } from '../../types';
import { MOCK_SPOTS } from '../../data/spots';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../../theme';

export default function PendingSpotsScreen() {
  const [spots, setSpots] = useState<Spot[]>(
    MOCK_SPOTS.filter((s) => s.status === 'pending')
  );
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = (spot: Spot) => {
    Alert.alert(
      'Approve Spot',
      `Are you sure you want to approve "${spot.name}"? It will go live immediately for all tourists.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: () => {
            setSpots((prev) => prev.filter((s) => s.id !== spot.id));
            Alert.alert('Approved ✅', `"${spot.name}" is now published on LiveLocal.`);
          },
        },
      ]
    );
  };

  const handleRejectSubmit = (spot: Spot) => {
    if (!rejectionReason.trim()) {
      Alert.alert('Validation Error', 'A mandatory rejection reason is required per FR23.');
      return;
    }
    setSpots((prev) => prev.filter((s) => s.id !== spot.id));
    setRejectingId(null);
    setRejectionReason('');
    Alert.alert(
      'Rejected ❌',
      `"${spot.name}" has been rejected. The submitter will be notified with reason: "${rejectionReason}".`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Submissions</Text>
        <Text style={styles.headerSubtitle}>
          {spots.length} {spots.length === 1 ? 'spot awaits' : 'spots await'} verification
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {spots.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="checkmark-done-outline" size={48} color={COLORS.success} />
            </View>
            <Text style={styles.emptyTitle}>Queue Cleared!</Text>
            <Text style={styles.emptySubtitle}>All pending spot submissions have been reviewed.</Text>
          </View>
        ) : (
          spots.map((spot) => (
            <View key={spot.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{spot.category}</Text>
                </View>
                <Text style={styles.locationText}>{spot.city}, {spot.state}</Text>
              </View>

              <Text style={styles.spotName}>{spot.name}</Text>
              <Text style={styles.descriptionText}>{spot.description}</Text>

              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>💡 Why Locals Go Here:</Text>
                <Text style={styles.infoText}>{spot.whyLocalsGoHere}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color={COLORS.accent} />
                <Text style={styles.infoRowText}>Best Time: {spot.bestVisitingTime}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.infoRowText}>{spot.address}</Text>
              </View>

              {rejectingId === spot.id ? (
                <View style={styles.rejectionBox}>
                  <Text style={styles.rejectionLabel}>Mandatory Rejection Reason (FR23):</Text>
                  <TextInput
                    style={styles.rejectionInput}
                    placeholder="E.g., Duplicate listing or insufficient details..."
                    placeholderTextColor={COLORS.textMuted}
                    value={rejectionReason}
                    onChangeText={setRejectionReason}
                  />
                  <View style={styles.rejectionActions}>
                    <TouchableOpacity
                      style={styles.cancelRejectButton}
                      onPress={() => {
                        setRejectingId(null);
                        setRejectionReason('');
                      }}
                    >
                      <Text style={styles.cancelRejectText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.confirmRejectButton}
                      onPress={() => handleRejectSubmit(spot)}
                    >
                      <Text style={styles.confirmRejectText}>Confirm Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    activeOpacity={0.8}
                    onPress={() => setRejectingId(spot.id)}
                  >
                    <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.approveButton}
                    activeOpacity={0.8}
                    onPress={() => handleApprove(spot)}
                  >
                    <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
                    <Text style={styles.approveButtonText}>Approve Spot</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryText: {
    color: '#FFF',
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
  },
  locationText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  spotName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  descriptionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  infoBox: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  infoTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.accent,
    marginBottom: 4,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoRowText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 71, 87, 0.15)',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  rejectButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    marginLeft: SPACING.xs,
  },
  approveButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginLeft: SPACING.sm,
    ...SHADOWS.sm,
  },
  approveButtonText: {
    color: '#FFF',
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    marginLeft: SPACING.xs,
  },
  rejectionBox: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  rejectionLabel: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.sm,
  },
  rejectionInput: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  rejectionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelRejectButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
  },
  cancelRejectText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  confirmRejectButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  confirmRejectText: {
    color: '#FFF',
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
  },
});
