
'use client';

import React,
{
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback
} from 'react';

interface User {
  walletAddress: string;
  twitterHandle?: string; // Reserved for future use
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  linkTwitter?: (handle: string) => void; // Reserved for future use
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((newUser: User) => {
    // In a real app, you'd get a JWT from your backend after verification
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    // In a real app, you'd also call a backend endpoint to invalidate the session
    setUser(null);
  }, []);

  // Placeholder for future implementation
  const linkTwitter = useCallback((handle: string) => {
    if (user) {
      setUser({ ...user, twitterHandle: handle });
      console.log(`Twitter account ${handle} linked to ${user.walletAddress}`);
    }
  }, [user]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, linkTwitter }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
