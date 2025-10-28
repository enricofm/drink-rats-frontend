'use client';

import { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { StarRating } from '@/components/StarRating';
import { usePost, usePosts } from '@/hooks/usePosts';
import { validateBeerPostForm } from '@/utils/validation';
import { theme } from '@/theme/theme';

export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: post, isLoading: isLoadingPost } = usePost(id);
  const { updatePost, isUpdating } = usePosts();

  const [beerName, setBeerName] = useState('');
  const [place, setPlace] = useState('');
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (post) {
      setBeerName(post.beerName);
      setPlace(post.place);
      setRating(post.rating);
      setNotes(post.notes || '');
      setImageUri(post.imageUrl);
    }
  }, [post]);

  const handlePickImage = async (source: 'camera' | 'library') => {
    try {
      let result: ImagePicker.ImagePickerResult | undefined;

      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant camera access');
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
          Alert.alert('Permission needed', 'Please grant photo library access');
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
      Alert.alert('Error', 'Could not select image.');
    }
  };

  const showImagePicker = () => {
    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: () => {
          void handlePickImage('camera');
        },
      },
      {
        text: 'Choose from Library',
        onPress: () => {
          void handlePickImage('library');
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    const validation = validateBeerPostForm(beerName, place, rating, imageUri);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await updatePost({
        id,
        beerName,
        place,
        rating,
        notes,
        imageUri: imageUri!,
      });
      router.back();
    } catch (error: unknown) {
      console.error('Error updating post:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to update post'
      );
    }
  };

  if (isLoadingPost) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

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
          accessibilityLabel="Change beer photo"
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
              <Text style={styles.imagePlaceholderText}>Change Photo</Text>
            </View>
          )}
        </TouchableOpacity>
        {!!errors.image && <Text style={styles.error}>{errors.image}</Text>}

        <Input
          label="Beer Name"
          value={beerName}
          onChangeText={(text) => {
            setBeerName(text);
            setErrors((prev) => ({ ...prev, beerName: '' }));
          }}
          error={errors.beerName}
          placeholder="e.g., Hazy IPA"
        />

        <Input
          label="Place"
          value={place}
          onChangeText={(text) => {
            setPlace(text);
            setErrors((prev) => ({ ...prev, place: '' }));
          }}
          error={errors.place}
          placeholder="e.g., Local Brewery"
        />

        <View style={styles.ratingContainer}>
          <Text style={styles.label}>Rating</Text>
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
          label="Notes (Optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Share your thoughts..."
          multiline
          numberOfLines={4}
          style={styles.notesInput}
        />

        <Button
          title="Update Post"
          onPress={handleSubmit}
          loading={isUpdating}
          fullWidth
          variant="primary"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
