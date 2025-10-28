"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/services/api"
import { useAuth } from "./useAuth"
import type { CreateBeerPostInput, UpdateBeerPostInput } from "@/types"

export const usePosts = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => api.getPosts(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const createPostMutation = useMutation({
    mutationFn: (data: CreateBeerPostInput) => api.createPost(data, token!),
    onMutate: async (newPost) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["posts"] })
      const previousPosts = queryClient.getQueryData(["posts"])

      queryClient.setQueryData(["posts"], (old: any) => {
        const optimisticPost = {
          id: `temp-${Date.now()}`,
          userId: useAuth.getState().user?.id || "",
          userName: useAuth.getState().user?.name || "",
          userAvatar: useAuth.getState().user?.avatar,
          ...newPost,
          imageUrl: newPost.imageUri,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        return [optimisticPost, ...(old || [])]
      })

      return { previousPosts }
    },
    onError: (err, newPost, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  const updatePostMutation = useMutation({
    mutationFn: (data: UpdateBeerPostInput) => api.updatePost(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  const deletePostMutation = useMutation({
    mutationFn: (id: string) => api.deletePost(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  return {
    posts: postsQuery.data || [],
    isLoading: postsQuery.isLoading,
    error: postsQuery.error,
    createPost: createPostMutation.mutateAsync,
    updatePost: updatePostMutation.mutateAsync,
    deletePost: deletePostMutation.mutateAsync,
    isCreating: createPostMutation.isPending,
    isUpdating: updatePostMutation.isPending,
    isDeleting: deletePostMutation.isPending,
  }
}

export const usePost = (id: string) => {
  const { token } = useAuth()

  return useQuery({
    queryKey: ["post", id],
    queryFn: () => api.getPost(id, token!),
    enabled: !!token && !!id,
  })
}
