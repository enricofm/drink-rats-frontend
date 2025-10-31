'use client';

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { validateRegisterForm } from '@/utils/validation';
import { theme } from '@/theme/theme';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

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
      showToast('Conta criada com sucesso!', 'success');
      setTimeout(() => router.replace('/(tabs)'), 500);
    } catch (error: any) {
      console.error('Registration error:', error);
      let message = 'Erro ao criar conta. Tente novamente';
      
      if (error?.message) {
        if (error.message.includes('409') || error.message.includes('já existe')) {
          message = 'Este email já está cadastrado';
        } else if (error.message.includes('400')) {
          message = 'Dados inválidos. Verifique os campos';
        } else if (error.message.includes('500')) {
          message = 'Erro no servidor. Tente novamente mais tarde';
        }
      }
      
      showToast(message, 'error');
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
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se à comunidade DrinkRats</Text>

          <View style={styles.form}>
            <Input
              label="Nome"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors((prev) => ({ ...prev, name: '' }));
              }}
              error={errors.name}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              placeholder="Seu nome"
              accessibilityLabel="Campo de nome"
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
              placeholder="seu@email.com"
              accessibilityLabel="Campo de email"
            />

            <Input
              label="Senha"
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
              accessibilityLabel="Campo de senha"
            />

            <Button
              title="Criar Conta"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              variant="primary"
            />

            <Button
              title="Voltar ao Login"
              onPress={() => router.back()}
              fullWidth
              variant="outline"
              style={styles.backButton}
            />
          </View>
        </View>
      </ScrollView>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
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
