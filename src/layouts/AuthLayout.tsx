
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background -z-10"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(var(--primary),0.1),transparent)] -z-10"></div>
      
      <header className="border-b py-4 bg-background/80 backdrop-blur-sm">
        <div className="container flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">GemMentor</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 container py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      
      <footer className="border-t py-6 bg-background/80 backdrop-blur-sm">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GemMentor - AI-powered study assistant
        </div>
      </footer>
    </div>
  );
}
