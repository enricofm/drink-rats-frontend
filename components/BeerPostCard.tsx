"use client"

import type React from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { StarRating } from "./StarRating"
import { theme } from "@/theme/theme"
import type { BeerPost } from "@/types"

interface BeerPostCardProps {
  post: BeerPost
}

export const BeerPostCard: React.FC<BeerPostCardProps> = ({ post }) => {
  const router = useRouter()

  const handlePress = () => {
    router.push(`/post/${post.id}`)
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Beer post: ${post.beerName} at ${post.place}, rated ${post.rating} stars`}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: post.userAvatar || "https://i.pravatar.cc/150" }}
          style={styles.avatar}
          accessible
          accessibilityLabel={`${post.userName}'s avatar`}
        />
        <View style={styles.headerText}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.timestamp}>{new Date(post.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <Image
        source={{ uri: post.imageUrl }}
        style={styles.image}
        resizeMode="cover"
        accessible
        accessibilityLabel={`Photo of ${post.beerName}`}
      />

      <View style={styles.content}>
        <Text style={styles.beerName}>{post.beerName}</Text>
        <Text style={styles.place}>{post.place}</Text>

        <View style={styles.ratingContainer}>
          <StarRating rating={post.rating} readonly size={20} />
        </View>

        {post.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {post.notes}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
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
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: theme.colors.secondary,
  },
  content: {
    padding: theme.spacing.md,
  },
  beerName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  place: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    marginBottom: theme.spacing.sm,
  },
  notes: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
})
