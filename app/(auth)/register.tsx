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
import { validateRegisterForm } from '@/utils/validation';
import { theme } from '@/theme/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    const validation = validateRegisterForm(name, email, password);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await register(name, email, password);
      router.replace('/(tabs)');
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert('Registration Failed', message || 'Please try again');
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
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the DrinkRats community</Text>

          <View style={styles.form}>
            <Input
              label="Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors((prev) => ({ ...prev, name: '' }));
              }}
              error={errors.name}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              placeholder="Your name"
              accessibilityLabel="Name input"
            />

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
              textContentType="newPassword"
              placeholder="••••••••"
              accessibilityLabel="Password input"
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              variant="primary"
            />

            <Button
              title="Back to Login"
              onPress={() => router.back()}
              fullWidth
              variant="outline"
              style={styles.backButton}
            />
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
  },
  content: {
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
    opacity: 0.9,
  },
  form: {
    gap: theme.spacing.md,
  },
  backButton: {
    marginTop: theme.spacing.sm,
    borderColor: theme.colors.white,
  },
});
