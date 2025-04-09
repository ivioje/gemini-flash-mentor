
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getUser, login as apiLogin, logout as apiLogout, register as apiRegister } from "../services/clientApiService";

// Define types
type User = {
  $id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  isAuthenticated: boolean;
};

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const checkUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Session validation error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await apiLogin(email, password);
      const user = await getUser();
      setUser(user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      await apiRegister(email, password, name);
      const user = await getUser();
      setUser(user);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
