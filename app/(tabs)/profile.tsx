'use client';

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { validateName } from '@/utils/validation';
import { theme } from '@/theme/theme';

export default function ProfileScreen() {
  const { user, token, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar);
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant photo library access');
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
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: avatar || 'https://i.pravatar.cc/150' }}
          style={styles.avatar}
          accessible
          accessibilityLabel="Profile avatar"
        />
        {isEditing && (
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={handlePickImage}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Change profile picture"
          >
            <Ionicons name="camera" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        )}
      </View>

      {isEditing ? (
        <View style={styles.form}>
          <Input
            label="Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNameError('');
            }}
            error={nameError}
            placeholder="Your name"
          />

          <View style={styles.buttonGroup}>
            <Button
              title="Save"
              onPress={handleSave}
              loading={isLoading}
              variant="primary"
              style={styles.button}
            />
            <Button
              title="Cancel"
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
            title="Edit Profile"
            onPress={() => setIsEditing(true)}
            variant="primary"
            fullWidth
            style={styles.editButton}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          fullWidth
        />
      </View>
    </ScrollView>
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
