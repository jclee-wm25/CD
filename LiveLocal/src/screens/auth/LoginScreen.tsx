import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../../theme';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    setErrorMessage('');
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const res = login(email.trim(), password);
    if (res.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    const res = login(quickEmail, quickPass);
    if (res.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } else {
      Alert.alert('Error', res.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Logo & Header */}
          <View style={styles.headerContainer}>
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
              style={styles.logoCircle}
            >
              <Ionicons name="location" size={44} color="#FFF" />
            </LinearGradient>
            <Text style={styles.appTitle}>LiveLocal</Text>
            <Text style={styles.appTagline}>Discover Malaysia Like a Local</Text>
          </View>

          {/* Login Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Welcome Back</Text>
            <Text style={styles.formSubtitle}>Sign in to save places, review spots, and explore.</Text>

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color={COLORS.error} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Email Address"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity onPress={handleLogin} activeOpacity={0.85}>
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Register Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.registerContainer}
            >
              <Text style={styles.registerText}>
                Don't have an account? <Text style={styles.registerHighlight}>Register</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Login Section for Demo */}
          <View style={styles.quickLoginSection}>
            <Text style={styles.quickLoginHeader}>DEMO QUICK LOGINS</Text>
            <View style={styles.quickLoginButtons}>
              <TouchableOpacity
                style={[styles.quickButton, { borderColor: COLORS.accent }]}
                onPress={() => handleQuickLogin('tourist@livelocal.my', 'password123')}
              >
                <Ionicons name="compass-outline" size={18} color={COLORS.accent} />
                <Text style={[styles.quickButtonText, { color: COLORS.accent }]}>Tourist</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickButton, { borderColor: COLORS.primary }]}
                onPress={() => handleQuickLogin('influencer@livelocal.my', 'password123')}
              >
                <Ionicons name="star-outline" size={18} color={COLORS.primary} />
                <Text style={[styles.quickButtonText, { color: COLORS.primary }]}>Influencer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickButton, { borderColor: COLORS.success }]}
                onPress={() => handleQuickLogin('admin@livelocal.my', 'admin123')}
              >
                <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.success} />
                <Text style={[styles.quickButtonText, { color: COLORS.success }]}>Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.huge,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.glow,
  },
  appTitle: {
    fontSize: FONT_SIZES.huge,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  formSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 71, 87, 0.15)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    height: 50,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
  },
  eyeIcon: {
    padding: SPACING.sm,
  },
  loginButton: {
    height: 52,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
    ...SHADOWS.sm,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  registerContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  registerText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  registerHighlight: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  quickLoginSection: {
    marginTop: SPACING.xxxl,
    alignItems: 'center',
  },
  quickLoginHeader: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
  },
  quickLoginButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  quickButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.xs,
  },
  quickButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    marginLeft: SPACING.xs,
  },
});
