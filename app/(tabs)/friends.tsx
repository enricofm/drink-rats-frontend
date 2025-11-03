'use client';

import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSearchUsers, useFriendActions } from '@/hooks/useFriends';
import { theme } from '@/theme/theme';

export default function FriendsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults = [], isLoading } = useSearchUsers(searchQuery);
  const { sendRequest, removeFriendship, isSending, isRemoving } =
    useFriendActions();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSendRequest = async (userId: string) => {
    try {
      setLoadingId(userId);
      await sendRequest(userId);
    } catch (error) {
      console.error('Error sending friend request:', error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemoveFriend = async (friendshipId: string | undefined) => {
    if (!friendshipId) return;
    try {
      setLoadingId(friendshipId);
      await removeFriendship(friendshipId);
    } catch (error) {
      console.error('Error removing friend:', error);
    } finally {
      setLoadingId(null);
    }
  };

  const renderUserCard = ({ item }: { item: any }) => {
    const isLoading = loadingId === item.id;
    const isActionDisabled =
      item.friendshipStatus === 'friends' ||
      item.friendshipStatus === 'request_sent';

    return (
      <View style={styles.userCard}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color={theme.colors.white} />
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.status}>
            {item.friendshipStatus === 'friends'
              ? '✓ Amigo'
              : item.friendshipStatus === 'request_sent'
              ? 'Solicitação enviada'
              : item.friendshipStatus === 'request_received'
              ? 'Solicitação recebida'
              : ''}
          </Text>
        </View>

        <View style={styles.actions}>
          {isLoading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : item.friendshipStatus === 'friends' ? (
            <TouchableOpacity
              onPress={() => handleRemoveFriend(item.friendshipId)}
              style={[styles.button, styles.removeButton]}
              disabled={isRemoving}
            >
              <Ionicons name="close" size={18} color={theme.colors.error} />
            </TouchableOpacity>
          ) : item.friendshipStatus === 'request_sent' ? (
            <Text style={styles.disabledText}>Enviado</Text>
          ) : item.friendshipStatus === 'request_received' ? (
            <Text style={styles.receivedText}>Recebido</Text>
          ) : (
            <TouchableOpacity
              onPress={() => handleSendRequest(item.id)}
              style={[styles.button, styles.addButton]}
              disabled={isActionDisabled || isSending}
            >
              <Ionicons
                name="person-add"
                size={18}
                color={theme.colors.white}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Procurar usuários..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {!!searchQuery && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="people-outline"
            size={64}
            color={theme.colors.textMuted}
          />
          <Text style={styles.emptyText}>Procure por amigos</Text>
          <Text style={styles.emptySubtext}>
            Digite um nome ou e-mail para encontrar e adicionar amigos
          </Text>
        </View>
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : searchResults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="search-outline"
            size={64}
            color={theme.colors.textMuted}
          />
          <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
          <Text style={styles.emptySubtext}>Tente outro nome ou e-mail</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderUserCard}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
  },
  clearButton: {
    padding: theme.spacing.sm,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  userEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  status: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium,
  },
  actions: {
    marginLeft: theme.spacing.md,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: theme.colors.primary,
  },
  removeButton: {
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  disabledText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  receivedText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
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
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
