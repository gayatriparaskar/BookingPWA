import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for authentication
export interface User {
  id: string;
  mobile: string;
  name?: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (mobile: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  signup: (mobile: string, password: string, name?: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
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

  const isAuthenticated = !!user;

  // Check if user is already authenticated on app start
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('authToken');
        }
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (mobile: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, password }),
      });

      // Read response text once
      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || 'Login failed. Please check your credentials.';
        } catch {
          errorMessage = 'Login failed. Please check your credentials.';
        }
        return {
          success: false,
          message: errorMessage
        };
      }

      // Parse JSON from the text we already read
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        return {
          success: false,
          message: 'Invalid response from server.'
        };
      }

      if (data.success) {
        const { user: userData, token } = data;
        setUser(userData);
        localStorage.setItem('authToken', token);
        return { success: true, user: userData };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed. Please check your credentials.'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  };

  // Signup function
  const signup = async (mobile: string, password: string, name?: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, password, name }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Signup failed. Please try again.';
        } catch {
          errorMessage = 'Signup failed. Please try again.';
        }
        return {
          success: false,
          message: errorMessage
        };
      }

      const data = await response.json();

      if (data.success) {
        const { user: userData, token } = data;
        setUser(userData);
        localStorage.setItem('authToken', token);
        return { success: true, user: userData };
      } else {
        return {
          success: false,
          message: data.message || 'Signup failed. Please try again.'
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
