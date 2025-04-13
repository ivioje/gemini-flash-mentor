
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "@/lib/firebase";

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
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Convert Firebase user to our app's user format
  const user = currentUser ? {
    $id: currentUser.uid,
    name: currentUser.displayName || 'User',
    email: currentUser.email || '',
  } : null;

  // Login function
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Logout function
  const logout = async () => {
    await signOut(auth);
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        isAuthenticated: !!currentUser,
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
