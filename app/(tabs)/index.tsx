'use client';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BeerPostCard } from '@/components/BeerPostCard';
import { usePosts } from '@/hooks/usePosts';
import { theme } from '@/theme/theme';

export default function FeedScreen() {
  const router = useRouter();
  const { posts, isLoading, error } = usePosts();

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load posts</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BeerPostCard post={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          isLoading ? null : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="beer-outline"
                size={64}
                color={theme.colors.textMuted}
              />
              <Text style={styles.emptyText}>No beer posts yet</Text>
              <Text style={styles.emptySubtext}>
                Start logging your beer adventures!
              </Text>
            </View>
          )
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/create-post')}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Create new beer post"
      >
        <Ionicons name="add" size={32} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
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
  listContent: {
    padding: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.error,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.md,
    bottom: theme.spacing.md,
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
