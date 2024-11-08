export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'github';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}