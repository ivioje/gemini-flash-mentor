
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateSet from "./pages/CreateSet";
import FlashcardSetDetail from "./pages/FlashcardSetDetail";
import StudySession from "./pages/StudySession";
import NotFound from "./pages/NotFound";
import AuthLayout from "./layouts/AuthLayout";
import Profile from "./pages/Profile";
import { SignInForm, SignUpForm } from "./components/AuthForms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              
              <Route path="/sign-in" element={
                <AuthLayout>
                  <SignInForm />
                </AuthLayout>
              } />

              <Route path="/sign-up" element={
                <AuthLayout>
                  <SignUpForm />
                </AuthLayout>
              } />

              <Route path="/dashboard" element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } />
              
              <Route path="/create" element={
                <RequireAuth>
                  <CreateSet />
                </RequireAuth>
              } />
              
              <Route path="/sets/:id" element={
                <RequireAuth>
                  <FlashcardSetDetail />
                </RequireAuth>
              } />
              
              <Route path="/study/:id" element={
                <RequireAuth>
                  <StudySession />
                </RequireAuth>
              } />
              
              <Route path="/profile" element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return <>{children}</>;
}

export default App;
