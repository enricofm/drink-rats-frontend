"use client"
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { StarRating } from "@/components/StarRating"
import { Button } from "@/components/Button"
import { usePost } from "@/hooks/usePosts"
import { usePosts } from "@/hooks/usePosts"
import { useAuth } from "@/hooks/useAuth"
import { theme } from "@/theme/theme"

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const { data: post, isLoading, error } = usePost(id)
  const { deletePost, isDeleting } = usePosts()

  const isOwner = post?.userId === user?.id

  const handleDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(id)
            router.back()
          } catch (error) {
            Alert.alert("Error", "Failed to delete post")
          }
        },
      },
    ])
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  if (error || !post) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load post</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: post.imageUrl }}
        style={styles.image}
        resizeMode="cover"
        accessible
        accessibilityLabel={`Photo of ${post.beerName}`}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={{ uri: post.userAvatar || "https://i.pravatar.cc/150" }}
            style={styles.avatar}
            accessible
            accessibilityLabel={`${post.userName}'s avatar`}
          />
          <View style={styles.headerText}>
            <Text style={styles.userName}>{post.userName}</Text>
            <Text style={styles.timestamp}>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>

        <Text style={styles.beerName}>{post.beerName}</Text>
        <Text style={styles.place}>{post.place}</Text>

        <View style={styles.ratingContainer}>
          <StarRating rating={post.rating} readonly size={28} />
          <Text style={styles.ratingText}>{post.rating} out of 5 stars</Text>
        </View>

        {post.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notes}>{post.notes}</Text>
          </View>
        )}

        {isOwner && (
          <View style={styles.actions}>
            <Button
              title="Edit"
              onPress={() => router.push(`/edit-post/${post.id}`)}
              variant="primary"
              style={styles.actionButton}
            />
            <Button
              title="Delete"
              onPress={handleDelete}
              loading={isDeleting}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.appBackground,
  },
  image: {
    width: "100%",
    height: 400,
    backgroundColor: theme.colors.secondary,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  userName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  timestamp: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  beerName: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  place: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  ratingText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  notesContainer: {
    marginBottom: theme.spacing.lg,
  },
  notesLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  notes: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.error,
  },
})
