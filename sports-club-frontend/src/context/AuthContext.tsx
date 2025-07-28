import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'member';
  membershipStatus: 'active' | 'inactive' | 'pending';
  profilePicture?: string;
  phone?: string;
  dateJoined: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for existing token and validate user session
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // TODO: Validate token with backend and get user data
          // For now, we'll simulate this
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data - replace with actual API call
          const mockUser: User = {
            id: '1',
            email: 'demo@sportsclub.com',
            firstName: 'Demo',
            lastName: 'User',
            role: 'member',
            membershipStatus: 'active',
            dateJoined: '2024-01-01'
          };
          setUser(mockUser);
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock login response
      const mockUser: User = {
        id: '1',
        email,
        firstName: email.split('@')[0],
        lastName: 'User',
        role: email.includes('admin') ? 'admin' : 'member',
        membershipStatus: 'active',
        dateJoined: '2024-01-01'
      };
      
      const mockToken = 'mock-jwt-token';
      
      localStorage.setItem('token', mockToken);
      setUser(mockUser);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock registration response
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'member',
        membershipStatus: 'pending',
        phone: userData.phone,
        dateJoined: new Date().toISOString().split('T')[0]
      };
      
      const mockToken = 'mock-jwt-token';
      
      localStorage.setItem('token', mockToken);
      setUser(newUser);
    } catch (err) {
      setError('Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    } catch (err) {
      setError('Profile update failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};