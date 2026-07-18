// ============================================
// LiveLocal - Edit Profile Screen
// ============================================
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../types';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
} from '../../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function EditProfileScreen() {
  const navigation = useNavigation<NavProp>();
  const { user, updateProfile, deleteAccount } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [tiktokHandle, setTiktokHandle] = useState(user?.socialMedia?.tiktok || '');
  const [instagramHandle, setInstagramHandle] = useState(user?.socialMedia?.instagram || '');
  const [isSaving, setIsSaving] = useState(false);
  const [nameError, setNameError] = useState('');

  if (!user) return null;

  const hasChanges =
    name !== user.name ||
    bio !== (user.bio || '') ||
    location !== (user.location || '') ||
    tiktokHandle !== (user.socialMedia?.tiktok || '') ||
    instagramHandle !== (user.socialMedia?.instagram || '');

  const handleSave = () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }
    setIsSaving(true);

    setTimeout(() => {
      updateProfile({
        name: name.trim(),
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
        socialMedia:
          user.role === 'influencer'
            ? {
                tiktok: tiktokHandle.trim() || undefined,
                instagram: instagramHandle.trim() || undefined,
              }
            : user.socialMedia,
      });
      setIsSaving(false);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }, 300);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Your account and all data will be permanently deleted.',
              [
                { text: 'Keep Account', style: 'cancel' },
                {
                  text: 'Delete Permanently',
                  style: 'destructive',
                  onPress: () => {
                    deleteAccount();
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  // Helper to get initials
  const getInitials = (n: string) =>
    n
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Preview */}
          <View style={styles.avatarSection}>
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarInitials}>{getInitials(name || user.name)}</Text>
            </LinearGradient>
            <Text style={styles.avatarHint}>Initials update as you type</Text>
          </View>

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <View style={[styles.inputContainer, nameError ? styles.inputError : null]}>
              <Ionicons name="person-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Your full name"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                autoCapitalize="words"
                onChangeText={(text) => {
                  setName(text);
                  setNameError('');
                }}
              />
            </View>
            {nameError ? <Text style={styles.fieldError}>{nameError}</Text> : null}
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="Tell us about yourself…"
                placeholderTextColor={COLORS.textMuted}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                maxLength={200}
                textAlignVertical="top"
              />
            </View>
            <Text style={styles.charCount}>{bio.length}/200</Text>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Kuala Lumpur"
                placeholderTextColor={COLORS.textMuted}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          {/* Social Media (Influencer only) */}
          {user.role === 'influencer' && (
            <>
              <View style={styles.sectionDivider}>
                <Text style={styles.sectionDividerText}>Social Media</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>TikTok Handle</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="logo-tiktok" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="@yourhandle"
                    placeholderTextColor={COLORS.textMuted}
                    value={tiktokHandle}
                    onChangeText={setTiktokHandle}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Instagram Handle</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="logo-instagram" size={20} color={COLORS.instagram} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="@yourhandle"
                    placeholderTextColor={COLORS.textMuted}
                    value={instagramHandle}
                    onChangeText={setInstagramHandle}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </>
          )}

          {/* Save Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={isSaving || !hasChanges}
          >
            <LinearGradient
              colors={
                hasChanges
                  ? [COLORS.gradientStart, COLORS.gradientEnd]
                  : [COLORS.surface, COLORS.surface]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color={hasChanges ? COLORS.textPrimary : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.saveButtonText,
                  !hasChanges && styles.saveButtonTextDisabled,
                ]}
              >
                {isSaving ? 'Saving…' : 'Save Changes'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Danger Zone */}
          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.7}
              onPress={handleDeleteAccount}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
            <Text style={styles.deleteHint}>
              This will permanently delete your account and all associated data.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },

  scrollContent: {
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.huge + SPACING.xxl,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginVertical: SPACING.xxl,
  },
  avatarGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow,
  },
  avatarInitials: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  avatarHint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },

  // Form
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    height: 54,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    marginRight: SPACING.md,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
  },
  fieldError: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },

  // Text Area
  textAreaContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    minHeight: 120,
  },
  textArea: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  charCount: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },

  // Section Divider
  sectionDivider: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionDividerText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Save Button
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    ...SHADOWS.glow,
  },
  saveButtonDisabled: {
    ...SHADOWS.sm,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  saveButtonTextDisabled: {
    color: COLORS.textMuted,
  },

  // Danger Zone
  dangerZone: {
    marginTop: SPACING.xxxl,
    padding: SPACING.xl,
    backgroundColor: 'rgba(255, 71, 87, 0.06)',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.15)',
  },
  dangerTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.error,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.md,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 71, 87, 0.12)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.25)',
  },
  deleteButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.error,
  },
  deleteHint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
    lineHeight: 18,
  },
});
