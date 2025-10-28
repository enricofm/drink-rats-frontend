'use client';

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { validateLoginForm } from '@/utils/validation';
import { theme } from '@/theme/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const validation = validateLoginForm(email, password);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Invalid email or password';
      Alert.alert('Login Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.wrapper}>
          <Text style={styles.title}>DrinkRats</Text>
          <Text style={styles.subtitle}>Track your beer journey</Text>

          <View style={styles.card}>
            <View style={styles.form}>
              <Input
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors((prev) => ({ ...prev, email: '' }));
                }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                placeholder="your@email.com"
                accessibilityLabel="Email input"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev) => ({ ...prev, password: '' }));
                }}
                error={errors.password}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
                placeholder="••••••••"
                accessibilityLabel="Password input"
              />

              <Button
                title="Log In"
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                style={styles.loginButton}
              />

              <Button
                title="Create Account"
                onPress={() => router.push('/register')}
                fullWidth
                variant="outline"
                style={styles.registerButton}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.loginBackground,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  wrapper: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  card: {
    width: '100%',
    padding: theme.spacing.lg,
    borderRadius: 16,
    backgroundColor: theme.colors.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  form: {
    gap: theme.spacing.md,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 14,
  },
  registerButton: {
    marginTop: theme.spacing.md,
    borderColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
});
