import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SocialAuthService from '../services/socialAuth';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_admin: boolean;
  preferred_language: string;
  avatar?: string;
  date_of_birth?: string;
  gender?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  // Social authentication methods
  googleLogin: () => Promise<boolean>;
  facebookLogin: () => Promise<boolean>;
  appleLogin: () => Promise<boolean>;
  getSocialAccounts: () => Promise<any>;
  disconnectSocial: () => Promise<boolean>;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  date_of_birth?: string;
  gender?: string;
  preferred_language?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.is_admin || false;

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          await fetchUserProfile();
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.data.user);
      } else {
        throw new Error(data.message || 'Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { user: userData, token: authToken } = data.data;
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('auth_token', authToken);
        return true;
      } else {
        console.error('Login failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        const { user: newUser, token: authToken } = data.data;
        setUser(newUser);
        setToken(authToken);
        localStorage.setItem('auth_token', authToken);
        return true;
      } else {
        console.error('Registration failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    if (token) {
      // Try to call logout endpoint, but don't wait for it
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch(console.error);
    }
    
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(prev => prev ? { ...prev, ...data.data.user } : null);
        return true;
      } else {
        console.error('Profile update failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        return true;
      } else {
        console.error('Password change failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Password change error:', error);
      return false;
    }
  };

  // Social Authentication Methods
  const googleLogin = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await SocialAuthService.googleSignIn();
      
      if (result.success) {
        const { user: userData, token: authToken } = result.data;
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('auth_token', authToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const facebookLogin = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await SocialAuthService.facebookSignIn();
      
      if (result.success) {
        const { user: userData, token: authToken } = result.data;
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('auth_token', authToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Facebook login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const appleLogin = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await SocialAuthService.appleSignIn();
      
      if (result.success) {
        const { user: userData, token: authToken } = result.data;
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('auth_token', authToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Apple login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getSocialAccounts = async (): Promise<any> => {
    if (!token) return null;
    try {
      return await SocialAuthService.getSocialAccounts(token);
    } catch (error) {
      console.error('Get social accounts error:', error);
      return null;
    }
  };

  const disconnectSocial = async (): Promise<boolean> => {
    if (!token) return false;
    try {
      const result = await SocialAuthService.disconnectSocial(token);
      if (result.success) {
        // Refresh user data
        await fetchUserProfile();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Disconnect social error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    // Social authentication methods
    googleLogin,
    facebookLogin,
    appleLogin,
    getSocialAccounts,
    disconnectSocial,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
