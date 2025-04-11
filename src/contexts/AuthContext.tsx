
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

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
  const { isLoaded, isSignedIn, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);
  
  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setFirebaseLoaded(true);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Convert Clerk user to our app's user format
  const user = clerkUser ? {
    $id: clerkUser.id,
    name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
  } : null;

  // Login function
  const login = async (email: string, password: string) => {
    // Using redirectToSignIn is handled by Clerk components
    console.log("Login handled by Clerk components");
  };

  // Logout function
  const logout = async () => {
    await signOut();
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    // Using redirectToSignUp is handled by Clerk components
    console.log("Register handled by Clerk components");
  };

  const isFullyLoaded = isLoaded && firebaseLoaded;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: !isFullyLoaded,
        login,
        logout,
        register,
        isAuthenticated: !!isSignedIn,
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
