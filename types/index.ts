export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface BeerPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  beerName: string;
  place: string;
  rating: number;
  notes?: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBeerPostInput {
  beerName: string;
  place: string;
  rating: number;
  notes?: string;
  imageUri: string;
}

export interface UpdateBeerPostInput extends Partial<CreateBeerPostInput> {
  id: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfileInput {
  name?: string;
  avatar?: string;
}

export interface SearchUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  friendshipStatus: 'none' | 'friends' | 'request_sent' | 'request_received';
  friendshipId?: string;
}

export interface Friendship {
  friendshipId: string;
  friend: User;
  createdAt: string;
}

export interface FriendRequest {
  friendshipId: string;
  sender: User;
  createdAt: string;
}

export interface SentFriendRequest {
  friendshipId: string;
  receiver: User;
  createdAt: string;
}
