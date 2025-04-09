
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateSet from "./pages/CreateSet";
import FlashcardSetDetail from "./pages/FlashcardSetDetail";
import StudySession from "./pages/StudySession";
import NotFound from "./pages/NotFound";
import AuthLayout from "./layouts/AuthLayout";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            <Route path="/sign-in/*" element={
              <AuthLayout>
                <SignIn routing="path" path="/sign-in" />
              </AuthLayout>
            } />

            <Route path="/sign-up/*" element={
              <AuthLayout>
                <SignUp routing="path" path="/sign-up" />
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
    </ThemeProvider>
  </QueryClientProvider>
);

function RequireAuth({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
}

export default App;
