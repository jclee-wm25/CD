// ============================================
// LiveLocal - Filter Modal Component
// ============================================
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onApply: () => void;
  onReset: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  title,
  children,
  onApply,
  onReset,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheetContainer}>
        <View style={[styles.sheet, SHADOWS.lg]}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={28} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Scrollable filter content from parent */}
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollInner}
          >
            {children}
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={onReset}
              activeOpacity={0.7}
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={onApply}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.applyGradient}
              >
                <Text style={styles.applyText}>Apply Filters</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.75,
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingBottom: SPACING.xxxl,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  scrollContent: {
    maxHeight: SCREEN_HEIGHT * 0.45,
  },
  scrollInner: {
    padding: SPACING.xl,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.md,
  },
  resetButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  resetText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  applyButton: {
    flex: 2,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  applyGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  applyText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
});

export default FilterModal;
