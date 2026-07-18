// ============================================
// LiveLocal - Submit Spot Screen
// ============================================
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
} from '../../theme';
import {
  SpotCategory,
  MalaysianState,
  PriceRange,
  RootStackParamList,
} from '../../types';
import { useAuth } from '../../contexts/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ALL_CATEGORIES: SpotCategory[] = [
  'Kopitiam', 'Hawker Stall', 'Night Market', 'Park', 'Cafe',
  'Temple', 'Street Art', 'Beach', 'Market', 'Heritage',
];

const CATEGORY_EMOJIS: Record<SpotCategory, string> = {
  Kopitiam: '☕',
  'Hawker Stall': '🍜',
  'Night Market': '🏮',
  Park: '🌿',
  Cafe: '🧁',
  Temple: '🛕',
  'Street Art': '🎨',
  Beach: '🏖️',
  Market: '🛒',
  Heritage: '🏛️',
};

const ALL_STATES: MalaysianState[] = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang',
  'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor',
  'Terengganu', 'Kuala Lumpur', 'Putrajaya', 'Labuan',
];

const ALL_PRICES: PriceRange[] = ['$', '$$', '$$$'];

// ---- Reusable form field ----
function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.labelRow}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {required && <Text style={styles.requiredStar}>*</Text>}
      </View>
      {children}
      {error && (
        <Text style={styles.errorText}>This field is required</Text>
      )}
    </View>
  );
}

// ---- Main screen ----
export default function SubmitSpotScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SpotCategory | null>(null);
  const [state, setState] = useState<MalaysianState | null>(null);
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [bestVisitingTime, setBestVisitingTime] = useState('');
  const [thingsToDoText, setThingsToDoText] = useState('');
  const [address, setAddress] = useState('');
  const [priceRange, setPriceRange] = useState<PriceRange | null>(null);

  // Validation
  const [attempted, setAttempted] = useState(false);

  // Picker modals
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);

  const requiredFields = {
    name: name.trim().length > 0,
    category: category !== null,
    state: state !== null,
    city: city.trim().length > 0,
    description: description.trim().length > 0,
    address: address.trim().length > 0,
    priceRange: priceRange !== null,
  };

  const isFormValid = Object.values(requiredFields).every(Boolean);

  const handleSubmit = () => {
    setAttempted(true);
    if (!isFormValid) {
      Alert.alert(
        'Missing Fields',
        'Please fill in all required fields before submitting.'
      );
      return;
    }

    Alert.alert(
      'Submit Spot 🎉',
      `"${name}" will be submitted for review. Our team will review your submission and notify you once it's approved.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            Alert.alert(
              'Submitted!',
              'Your spot has been submitted for review. You\'ll be notified once it\'s approved.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Submit a Spot</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Intro card */}
          <LinearGradient
            colors={[COLORS.primary + '15', COLORS.primary + '05']}
            style={styles.introCard}
          >
            <Ionicons name="sparkles" size={24} color={COLORS.primary} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.introTitle}>Share a Hidden Gem</Text>
              <Text style={styles.introSubtitle}>
                Help other travelers discover amazing local spots that only locals know about.
              </Text>
            </View>
          </LinearGradient>

          {/* Photo upload placeholder */}
          <TouchableOpacity style={styles.photoUpload} activeOpacity={0.7}>
            <LinearGradient
              colors={[COLORS.surface, COLORS.card]}
              style={styles.photoUploadGradient}
            >
              <View style={styles.photoUploadIcon}>
                <Ionicons name="camera-outline" size={32} color={COLORS.textMuted} />
              </View>
              <Text style={styles.photoUploadText}>Add Photos</Text>
              <Text style={styles.photoUploadSubtext}>
                Tap to upload photos of this spot
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Name */}
          <FormField label="Spot Name" required error={attempted && !requiredFields.name}>
            <TextInput
              style={[
                styles.textInput,
                attempted && !requiredFields.name && styles.inputError,
              ]}
              placeholder="e.g. Kedai Kopi Uncle Tan"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
            />
          </FormField>

          {/* Category */}
          <FormField label="Category" required error={attempted && !requiredFields.category}>
            <TouchableOpacity
              style={[
                styles.pickerButton,
                attempted && !requiredFields.category && styles.inputError,
              ]}
              onPress={() => setShowCategoryPicker(true)}
            >
              <Text
                style={[
                  styles.pickerText,
                  !category && { color: COLORS.textMuted },
                ]}
              >
                {category
                  ? `${CATEGORY_EMOJIS[category]} ${category}`
                  : 'Select a category'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </FormField>

          {/* State */}
          <FormField label="State" required error={attempted && !requiredFields.state}>
            <TouchableOpacity
              style={[
                styles.pickerButton,
                attempted && !requiredFields.state && styles.inputError,
              ]}
              onPress={() => setShowStatePicker(true)}
            >
              <Text
                style={[
                  styles.pickerText,
                  !state && { color: COLORS.textMuted },
                ]}
              >
                {state || 'Select a state'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </FormField>

          {/* City */}
          <FormField label="City" required error={attempted && !requiredFields.city}>
            <TextInput
              style={[
                styles.textInput,
                attempted && !requiredFields.city && styles.inputError,
              ]}
              placeholder="e.g. George Town"
              placeholderTextColor={COLORS.textMuted}
              value={city}
              onChangeText={setCity}
            />
          </FormField>

          {/* Description */}
          <FormField label="Description" required error={attempted && !requiredFields.description}>
            <TextInput
              style={[
                styles.textArea,
                attempted && !requiredFields.description && styles.inputError,
              ]}
              placeholder="Describe what makes this place special..."
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </FormField>

          {/* Best Visiting Time */}
          <FormField label="Best Visiting Time">
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Early morning 6:30 AM – 10:00 AM"
              placeholderTextColor={COLORS.textMuted}
              value={bestVisitingTime}
              onChangeText={setBestVisitingTime}
            />
          </FormField>

          {/* Things to Do */}
          <FormField label="Things to Do">
            <TextInput
              style={styles.textArea}
              placeholder="Enter each activity on a new line, e.g.&#10;Try the kopi-o&#10;Order kaya toast&#10;Chat with the owner"
              placeholderTextColor={COLORS.textMuted}
              value={thingsToDoText}
              onChangeText={setThingsToDoText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.fieldHint}>One item per line</Text>
          </FormField>

          {/* Address */}
          <FormField label="Address" required error={attempted && !requiredFields.address}>
            <TextInput
              style={[
                styles.textArea,
                { minHeight: 60 },
                attempted && !requiredFields.address && styles.inputError,
              ]}
              placeholder="Full address including postcode"
              placeholderTextColor={COLORS.textMuted}
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
          </FormField>

          {/* Price Range */}
          <FormField label="Price Range" required error={attempted && !requiredFields.priceRange}>
            <View style={styles.priceRow}>
              {ALL_PRICES.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.pricePill,
                    priceRange === p && styles.pricePillActive,
                    attempted && !requiredFields.priceRange && styles.priceError,
                  ]}
                  onPress={() => setPriceRange(p)}
                >
                  <Text
                    style={[
                      styles.pricePillText,
                      priceRange === p && styles.pricePillTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                  <Text
                    style={[
                      styles.priceLabel,
                      priceRange === p && styles.priceLabelActive,
                    ]}
                  >
                    {p === '$' ? 'Budget' : p === '$$' ? 'Moderate' : 'Premium'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </FormField>

          {/* Submitter info */}
          {user && (
            <View style={styles.submitterCard}>
              <Ionicons name="person-circle-outline" size={20} color={COLORS.textMuted} />
              <Text style={styles.submitterText}>
                Submitting as <Text style={styles.submitterName}>{user.name}</Text>
              </Text>
            </View>
          )}

          {/* Submit button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="rocket-outline" size={20} color="#FFF" />
              <Text style={styles.submitText}>Submit for Review</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Your submission will be reviewed by our team before it appears publicly. This usually takes 24-48 hours.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category picker modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={ALL_CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.pickerItem,
                    category === item && styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    setCategory(item);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemEmoji}>
                    {CATEGORY_EMOJIS[item]}
                  </Text>
                  <Text
                    style={[
                      styles.pickerItemText,
                      category === item && styles.pickerItemTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {category === item && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* State picker modal */}
      <Modal
        visible={showStatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select State</Text>
              <TouchableOpacity onPress={() => setShowStatePicker(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={ALL_STATES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.pickerItem,
                    state === item && styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    setState(item);
                    setShowStatePicker(false);
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={
                      state === item
                        ? COLORS.primary
                        : COLORS.textMuted
                    }
                    style={{ marginRight: SPACING.md }}
                  />
                  <Text
                    style={[
                      styles.pickerItemText,
                      state === item && styles.pickerItemTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {state === item && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },

  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: 60,
  },

  // Intro
  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  introTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    marginBottom: 2,
  },
  introSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  // Photo upload
  photoUpload: {
    marginBottom: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  photoUploadGradient: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  photoUploadIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  photoUploadText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  photoUploadSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Form fields
  fieldContainer: {
    marginBottom: SPACING.lg,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  fieldLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  requiredStar: {
    fontSize: FONT_SIZES.md,
    color: COLORS.error,
    marginLeft: 4,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: 4,
  },
  fieldHint: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },

  // Picker button
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pickerText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },

  // Price
  priceRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  pricePill: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pricePillActive: {
    backgroundColor: COLORS.success + '15',
    borderColor: COLORS.success,
  },
  priceError: {
    borderColor: COLORS.error,
  },
  pricePillText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textSecondary,
  },
  pricePillTextActive: {
    color: COLORS.success,
  },
  priceLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  priceLabelActive: {
    color: COLORS.success,
  },

  // Submitter
  submitterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  submitterText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  submitterName: {
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semibold,
  },

  // Submit button
  submitButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.glow,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  submitText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFF',
  },
  disclaimer: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    paddingTop: SPACING.xl,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },

  // Picker items
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '40',
  },
  pickerItemActive: {
    backgroundColor: COLORS.primary + '10',
  },
  pickerItemEmoji: {
    fontSize: 22,
    marginRight: SPACING.md,
  },
  pickerItemText: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  pickerItemTextActive: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
});
