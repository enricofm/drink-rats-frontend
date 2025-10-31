'use client';

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { validateName } from '@/utils/validation';
import { theme } from '@/theme/theme';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function ProfileScreen() {
  const { user, token, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar);
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      showToast('Permissão necessária para acessar a galeria', 'warning');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const error = validateName(name);
    if (error) {
      setNameError(error);
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await api.updateProfile({ name, avatar }, token!);
      updateUser(updatedUser);
      setIsEditing(false);
      showToast('Perfil atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showToast('Erro ao atualizar perfil', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: avatar || 'https://i.pravatar.cc/150' }}
          style={styles.avatar}
          accessible
          accessibilityLabel="Avatar do perfil"
        />
        {isEditing && (
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={handlePickImage}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Alterar foto de perfil"
          >
            <Ionicons name="camera" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        )}
      </View>

      {isEditing ? (
        <View style={styles.form}>
          <Input
            label="Nome"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNameError('');
            }}
            error={nameError}
            placeholder="Seu nome"
          />

          <View style={styles.buttonGroup}>
            <Button
              title="Salvar"
              onPress={handleSave}
              loading={isLoading}
              variant="primary"
              style={styles.button}
            />
            <Button
              title="Cancelar"
              onPress={() => {
                setIsEditing(false);
                setName(user?.name || '');
                setAvatar(user?.avatar);
                setNameError('');
              }}
              variant="outline"
              style={styles.button}
            />
          </View>
        </View>
      ) : (
        <View style={styles.info}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          <Button
            title="Editar Perfil"
            onPress={() => setIsEditing(true)}
            variant="primary"
            fullWidth
            style={styles.editButton}
          />
        </View>
      )}

      <View style={styles.section}>
        <Button
          title="Sair da conta"
          onPress={handleLogout}
          variant="outline"
          fullWidth
        />
      </View>
    </ScrollView>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
  },
  content: {
    padding: theme.spacing.xl,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.full,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.appBackground,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
  },
  info: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  editButton: {
    marginTop: theme.spacing.md,
  },
  section: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
});
