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
import { Ionicons } from '@expo/vector-icons';
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
        error instanceof Error ? error.message : 'Email ou senha inválidos';
      Alert.alert('Login falhou', message);
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
          <Text style={styles.subtitle}>Acompanhe sua jornada cervejeira</Text>

          <View style={styles.form}>
              <View>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#999" style={styles.icon} />
                  <Input
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    placeholder="E-mail"
                    accessibilityLabel="Campo de e-mail"
                    style={styles.inputWithIcon}
                    containerStyle={styles.inputContainer}
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
                  <Input
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                    textContentType="password"
                    placeholder="Senha"
                    accessibilityLabel="Campo de senha"
                    style={styles.inputWithIcon}
                    containerStyle={styles.inputContainer}
                  />
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              <Button
                title="Entrar"
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                style={styles.loginButton}
              />

              <Button
                title="Criar Conta"
                onPress={() => router.push('/register')}
                fullWidth
                variant="outline"
                style={styles.registerButton}
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
    padding: theme.spacing.lg,
  },
  wrapper: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  form: {
    width: '100%',
    gap: theme.spacing.md,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  inputContainer: {
    marginBottom: 0,
  },
  icon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  inputWithIcon: {
    backgroundColor: '#ffffff',
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 0,
    height: 52,
    color: '#000000',
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 14,
  },
  registerButton: {
    marginTop: theme.spacing.md,
    borderRadius: 12,
    paddingVertical: 14,
  },
});
