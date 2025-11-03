'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuth } from './useAuth';

export const useSearchUsers = (query: string) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['search-users', query],
    queryFn: () => api.searchUsers(query, token!),
    enabled: !!token && query.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFriends = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['friends'],
    queryFn: () => api.getFriends(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFriendActions = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const sendRequestMutation = useMutation({
    mutationFn: (receiverId: string) =>
      api.sendFriendRequest(receiverId, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search-users'] });
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: (friendshipId: string) =>
      api.acceptFriendRequest(friendshipId, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const removeFriendshipMutation = useMutation({
    mutationFn: (friendshipId: string) =>
      api.removeFriendship(friendshipId, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['search-users'] });
    },
  });

  return {
    sendRequest: sendRequestMutation.mutateAsync,
    acceptRequest: acceptRequestMutation.mutateAsync,
    removeFriendship: removeFriendshipMutation.mutateAsync,
    isSending: sendRequestMutation.isPending,
    isAccepting: acceptRequestMutation.isPending,
    isRemoving: removeFriendshipMutation.isPending,
  };
};
