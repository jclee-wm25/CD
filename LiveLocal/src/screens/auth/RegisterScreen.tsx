// ============================================
// LiveLocal - Register Screen
// ============================================
import React, { useState, useRef } from 'react';
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
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList, UserRole } from '../../types';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
} from '../../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavProp>();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'tourist' | 'influencer'>('tourist');
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Field errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const buttonScale = useRef(new Animated.Value(1)).current;

  const validateForm = (): boolean => {
    let valid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setError('');

    if (!name.trim()) {
      setNameError('Name is required');
      valid = false;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Enter a valid email address');
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    }

    return valid;
  };

  const handleRegister = () => {
    if (!validateForm()) return;
    setIsLoading(true);

    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      const result = register(name.trim(), email.trim(), password, role as UserRole);
      setIsLoading(false);
      if (result.success) {
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      } else {
        setError(result.message);
      }
    }, 300);
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    icon: keyof typeof Ionicons.glyphMap,
    fieldError: string,
    options?: {
      placeholder?: string;
      secureTextEntry?: boolean;
      keyboardType?: 'default' | 'email-address';
      autoCapitalize?: 'none' | 'sentences' | 'words';
      showToggle?: boolean;
    }
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputContainer, fieldError ? styles.inputError : null]}>
        <Ionicons name={icon} size={20} color={COLORS.textMuted} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={options?.placeholder || label}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={options?.secureTextEntry && !showPassword}
          keyboardType={options?.keyboardType || 'default'}
          autoCapitalize={options?.autoCapitalize ?? 'sentences'}
          autoCorrect={false}
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            setError('');
          }}
        />
        {options?.showToggle && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {fieldError ? <Text style={styles.fieldError}>{fieldError}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <LinearGradient
        colors={[COLORS.background, '#0F1330', COLORS.background]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Create Account</Text>
                <Text style={styles.headerSubtitle}>Join the LiveLocal community</Text>
              </View>
            </View>

            {/* Global Error */}
            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color={COLORS.error} />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            ) : null}

            {/* Form Fields */}
            {renderInput('Full Name', name, (t) => { setName(t); setNameError(''); }, 'person-outline', nameError, {
              placeholder: 'Your full name',
              autoCapitalize: 'words',
            })}

            {renderInput('Email', email, (t) => { setEmail(t); setEmailError(''); }, 'mail-outline', emailError, {
              placeholder: 'your@email.com',
              keyboardType: 'email-address',
              autoCapitalize: 'none',
            })}

            {renderInput('Password', password, (t) => { setPassword(t); setPasswordError(''); }, 'lock-closed-outline', passwordError, {
              placeholder: 'Min. 6 characters',
              secureTextEntry: true,
              showToggle: true,
              autoCapitalize: 'none',
            })}

            {renderInput('Confirm Password', confirmPassword, (t) => { setConfirmPassword(t); setConfirmPasswordError(''); }, 'lock-closed-outline', confirmPasswordError, {
              placeholder: 'Re-enter your password',
              secureTextEntry: true,
              autoCapitalize: 'none',
            })}

            {/* Role Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>I am a…</Text>
              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[styles.roleButton, role === 'tourist' && styles.roleButtonActive]}
                  onPress={() => setRole('tourist')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="airplane-outline"
                    size={20}
                    color={role === 'tourist' ? COLORS.textPrimary : COLORS.textMuted}
                  />
                  <Text
                    style={[styles.roleButtonText, role === 'tourist' && styles.roleButtonTextActive]}
                  >
                    Tourist
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleButton, role === 'influencer' && styles.roleButtonActive]}
                  onPress={() => setRole('influencer')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="star-outline"
                    size={20}
                    color={role === 'influencer' ? COLORS.textPrimary : COLORS.textMuted}
                  />
                  <Text
                    style={[styles.roleButtonText, role === 'influencer' && styles.roleButtonTextActive]}
                  >
                    Influencer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Influencer Fields */}
            {role === 'influencer' && (
              <View style={styles.influencerSection}>
                <View style={styles.influencerBadge}>
                  <Ionicons name="information-circle-outline" size={16} color={COLORS.accent} />
                  <Text style={styles.influencerBadgeText}>
                    Influencer accounts require approval before listing restaurants
                  </Text>
                </View>

                {renderInput('TikTok Handle', tiktokHandle, setTiktokHandle, 'logo-tiktok', '', {
                  placeholder: '@yourhandle',
                  autoCapitalize: 'none',
                })}

                {renderInput('Instagram Handle', instagramHandle, setInstagramHandle, 'logo-instagram', '', {
                  placeholder: '@yourhandle',
                  autoCapitalize: 'none',
                })}
              </View>
            )}

            {/* Register Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: SPACING.lg }}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.registerButton}
                >
                  {isLoading ? (
                    <Text style={styles.registerButtonText}>Creating account…</Text>
                  ) : (
                    <>
                      <Ionicons name="person-add-outline" size={22} color={COLORS.textPrimary} />
                      <Text style={styles.registerButtonText}>Create Account</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.loginTextBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.huge,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxxl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 71, 87, 0.12)',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.25)',
  },
  errorBannerText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.error,
    marginLeft: SPACING.sm,
    flex: 1,
  },

  // Role Selector
  roleRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  roleButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  roleButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textMuted,
  },
  roleButtonTextActive: {
    color: COLORS.textPrimary,
  },

  // Influencer
  influencerSection: {
    marginBottom: SPACING.sm,
  },
  influencerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 180, 216, 0.1)',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 180, 216, 0.2)',
  },
  influencerBadgeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.accent,
    marginLeft: SPACING.sm,
    flex: 1,
    lineHeight: 18,
  },

  // Register Button
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    ...SHADOWS.glow,
  },
  registerButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },

  // Login Link
  loginLink: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxxl,
  },
  loginText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  loginTextBold: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
  },
});
