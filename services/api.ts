import Constants from 'expo-constants';

import type {
  User,
  BeerPost,
  CreateBeerPostInput,
  UpdateBeerPostInput,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  UpdateProfileInput,
} from '@/types';

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl || 'http://10.0.2.2:3000';
const USE_MOCK_DATA =
  Constants.expoConfig?.extra?.useMockData === 'true';


// Dados mock para desenvolvimento
const mockUser: User = {
  id: '1',
  email: 'demo@drinkrats.app',
  name: 'Amante de Cerveja',
  avatar: 'https://i.pravatar.cc/150?img=12',
  createdAt: new Date().toISOString(),
};

const mockPosts: BeerPost[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Amante de Cerveja',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    beerName: 'American IPA',
    place: 'Cervejaria Local',
    rating: 5,
    notes: 'Notas cítricas incríveis com um final suave!',
    imageUrl: '/hazy-ipa-beer-glass.jpg',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    userId: '2',
    userName: 'Fã de Cerveja Artesanal',
    userAvatar: 'https://i.pravatar.cc/150?img=8',
    beerName: 'Belgian Dubbel',
    place: 'Jardim da Cerveja',
    rating: 4,
    notes: 'Sabor rico e maltado com toques de frutas escuras.',
    imageUrl: '/belgian-dubbel-beer.jpg',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const mockToken = 'mock-jwt-token';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return this.mockRequest<T>(endpoint, options);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('  ❌ API Error Response:', errorBody);
        
        
        if (response.status === 401) {
          console.warn('  🔐 Token inválido - considere fazer logout/login novamente');
        }
        
       
        const apiError = new Error(`Erro da API (${response.status}): ${response.statusText || errorBody}`);
        (apiError as any).status = response.status;
        (apiError as any).isApiError = true;
        throw apiError;
      }

      return response.json();
    } catch (error: any) {
  
      if (error.isApiError) {
        console.error('  ❌ API Error - não fazendo fallback:', error.message);
        throw error;
      }
    
      console.error('  ❌ Network request failed:', error);
      console.warn(
        'Falha na requisição de rede, voltando para dados mock:',
        error
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      return this.mockRequest<T>(endpoint, options);
    }
  }

  private mockRequest<T>(endpoint: string, options: RequestInit): T {
    const method = options.method || 'GET';

    // Endpoints de autenticação
    if (endpoint === '/auth/login' && method === 'POST') {
      return { user: mockUser, token: mockToken } as T;
    }

    if (endpoint === '/auth/register' && method === 'POST') {
      return { user: mockUser, token: mockToken } as T;
    }

    if (endpoint === '/auth/me' && method === 'GET') {
      return mockUser as T;
    }

    // Endpoints de posts
    if (endpoint === '/posts' && method === 'GET') {
      return mockPosts as T;
    }

    if (endpoint.startsWith('/posts/') && method === 'GET') {
      const id = endpoint.split('/')[2];
      const post = mockPosts.find((p) => p.id === id);
      if (!post) throw new Error('Post não encontrado');
      return post as T;
    }

    if (endpoint === '/posts' && method === 'POST') {
      const body = JSON.parse(options.body as string) as CreateBeerPostInput;
      const newPost: BeerPost = {
        id: String(mockPosts.length + 1),
        userId: mockUser.id,
        userName: mockUser.name,
        userAvatar: mockUser.avatar,
        beerName: body.beerName,
        place: body.place,
        rating: body.rating,
        notes: body.notes,
        imageUrl: body.imageUri,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockPosts.unshift(newPost);
      return newPost as T;
    }

    if (endpoint.startsWith('/posts/') && method === 'PUT') {
      const id = endpoint.split('/')[2];
      const body = JSON.parse(options.body as string) as UpdateBeerPostInput;
      const postIndex = mockPosts.findIndex((p) => p.id === id);
      if (postIndex === -1) throw new Error('Post não encontrado');

      mockPosts[postIndex] = {
        ...mockPosts[postIndex],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      return mockPosts[postIndex] as T;
    }

    if (endpoint.startsWith('/posts/') && method === 'DELETE') {
      const id = endpoint.split('/')[2];
      const postIndex = mockPosts.findIndex((p) => p.id === id);
      if (postIndex === -1) throw new Error('Post não encontrado');
      mockPosts.splice(postIndex, 1);
      return { success: true } as T;
    }

    // Endpoints de perfil
    if (endpoint === '/profile' && method === 'PUT') {
      const body = JSON.parse(options.body as string) as UpdateProfileInput;
      Object.assign(mockUser, body);
      return mockUser as T;
    }

    throw new Error(`Endpoint mock não implementado: ${method} ${endpoint}`);
  }

  // Auth
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(token: string): Promise<User> {
    return this.request<User>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Posts
  async getPosts(token: string): Promise<BeerPost[]> {
    return this.request<BeerPost[]>('/posts', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getPost(id: string, token: string): Promise<BeerPost> {
    return this.request<BeerPost>(`/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createPost(
    data: CreateBeerPostInput,
    token: string
  ): Promise<BeerPost> {
    return this.request<BeerPost>('/posts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async updatePost(
    data: UpdateBeerPostInput,
    token: string
  ): Promise<BeerPost> {
    return this.request<BeerPost>(`/posts/${data.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async deletePost(id: string, token: string): Promise<void> {
    return this.request<void>(`/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Perfil
  async updateProfile(data: UpdateProfileInput, token: string): Promise<User> {
    return this.request<User>('/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiService();
