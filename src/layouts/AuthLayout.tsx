
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl">GemMentor</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 container py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GemMentor - AI-powered study assistant
        </div>
      </footer>
    </div>
  );
}
