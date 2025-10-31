'use client';

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { StarRating } from '@/components/StarRating';
import { usePosts } from '@/hooks/usePosts';
import { validateBeerPostForm } from '@/utils/validation';
import { theme } from '@/theme/theme';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function CreatePostScreen() {
  const router = useRouter();
  const { createPost, isCreating } = usePosts();
  const [beerName, setBeerName] = useState('');
  const [place, setPlace] = useState('');
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast, showToast, hideToast } = useToast();

  const handlePickImage = async (source: 'camera' | 'library') => {
    try {
      let result: ImagePicker.ImagePickerResult | undefined;

      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          showToast('Permissão necessária para usar a câmera', 'warning');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          showToast('Permissão necessária para acessar a galeria', 'warning');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (
        result &&
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        setImageUri(result.assets[0].uri);
        setErrors((prev) => ({ ...prev, image: '' }));
      }
    } catch (err) {
      console.warn('Erro ao selecionar imagem', err);
      showToast('Não foi possível selecionar a imagem', 'error');
    }
  };

  const showImagePicker = () => {
    Alert.alert('Selecionar Imagem', 'Escolha uma opção', [
      {
        text: 'Tirar Foto',
        onPress: () => {
          void handlePickImage('camera');
        },
      },
      {
        text: 'Escolher da Galeria',
        onPress: () => {
          void handlePickImage('library');
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    const validation = validateBeerPostForm(beerName, place, rating, imageUri);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await createPost({
        beerName,
        place,
        rating,
        notes,
        imageUri: imageUri!,
      });
      showToast('Post criado com sucesso!', 'success');
      setTimeout(() => router.back(), 500);
    } catch (error: unknown) {
      console.error('Failed to create post:', error);
      const message = error instanceof Error ? error.message : 'Erro ao criar post';
      showToast(message, 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={showImagePicker}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Selecionar foto da cerveja"
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="camera"
                size={48}
                color={theme.colors.textMuted}
              />
              <Text style={styles.imagePlaceholderText}>Adicionar Foto</Text>
            </View>
          )}
        </TouchableOpacity>
        {!!errors.image && <Text style={styles.error}>{errors.image}</Text>}

        <Input
          label="Nome da Cerveja"
          value={beerName}
          onChangeText={(text) => {
            setBeerName(text);
            setErrors((prev) => ({ ...prev, beerName: '' }));
          }}
          error={errors.beerName}
          placeholder="ex: American IPA"
        />

        <Input
          label="Local"
          value={place}
          onChangeText={(text) => {
            setPlace(text);
            setErrors((prev) => ({ ...prev, place: '' }));
          }}
          error={errors.place}
          placeholder="ex: Cervejaria Local"
        />

        <View style={styles.ratingContainer}>
          <Text style={styles.label}>Avaliação</Text>
          <StarRating
            rating={rating}
            onRatingChange={(value) => {
              setRating(value);
              setErrors((prev) => ({ ...prev, rating: '' }));
            }}
          />
          {!!errors.rating && <Text style={styles.error}>{errors.rating}</Text>}
        </View>

        <Input
          label="Notas (Opcional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Compartilhe suas impressões..."
          multiline
          numberOfLines={4}
          style={styles.notesInput}
        />

        <Button
          title="Publicar"
          onPress={handleSubmit}
          loading={isCreating}
          fullWidth
          variant="primary"
        />
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
    backgroundColor: theme.colors.appBackground,
  },
  content: {
    padding: theme.spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  ratingContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
});
