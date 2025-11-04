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
  FlatList,
  ActivityIndicator,
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
import { useFriends } from '@/hooks/useFriends';

export default function ProfileScreen() {
  const { user, token, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar);
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const { data: friendsList = [], isLoading: isFriendsLoading } = useFriends();

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

  const renderFriendCard = ({ item }: { item: any }) => (
    <View style={styles.friendCard}>
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
      ) : (
        <View style={styles.friendAvatarPlaceholder}>
          <Ionicons name="person" size={24} color={theme.colors.white} />
        </View>
      )}
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
      </View>
    </View>
  );

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={styles.avatar}
              accessible
              accessibilityLabel="Avatar do perfil"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={60} color={theme.colors.white} />
            </View>
          )}
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
                variant="transparent"
                style={styles.button}
              />
            </View>
          </View>
        ) : (
          <View style={styles.info}>
            <Text style={styles.name}>{user?.name}</Text>

            <Button
              title="Editar Perfil"
              onPress={() => setIsEditing(true)}
              variant="primary"
              fullWidth
              style={styles.editButton}
            />
          </View>
        )}

        <View style={styles.friendsSection}>
          <Text style={styles.sectionTitle}>
            Meus Amigos ({friendsList.length})
          </Text>
          {isFriendsLoading ? (
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
              style={styles.loader}
            />
          ) : friendsList.length === 0 ? (
            <View style={styles.emptyFriendsContainer}>
              <Ionicons
                name="people-outline"
                size={48}
                color={theme.colors.textMuted}
              />
              <Text style={styles.emptyFriendsText}>Nenhum amigo ainda</Text>
              <Text style={styles.emptyFriendsSubtext}>
                Use a aba de busca para adicionar amigos
              </Text>
            </View>
          ) : (
            <FlatList
              data={friendsList}
              keyExtractor={(item) => item.id}
              renderItem={renderFriendCard}
              scrollEnabled={false}
              contentContainerStyle={styles.friendsList}
            />
          )}
        </View>

        <View style={styles.section}>
          <Button
            title="Sair da conta"
            onPress={handleLogout}
            variant="transparent"
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
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
  editButton: {
    marginTop: theme.spacing.md,
  },
  section: {
    marginTop: theme.spacing.xl,
  },
  friendsSection: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  friendsList: {
    gap: theme.spacing.md,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  friendAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: theme.spacing.md,
  },
  friendAvatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  loader: {
    marginVertical: theme.spacing.lg,
  },
  emptyFriendsContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyFriendsText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  emptyFriendsSubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});
