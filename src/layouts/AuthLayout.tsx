
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Glassmorphism background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background -z-10"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(var(--primary),0.15),transparent)] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-[30%] bg-[radial-gradient(ellipse_at_bottom_left,rgba(var(--primary),0.1),transparent)] -z-10"></div>
      
      {/* Glass card decorative elements */}
      <motion.div 
        className="absolute top-[10%] left-[3%] w-32 h-32 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 -z-5 hidden lg:block"
        initial={{ rotate: 15, x: -50, opacity: 0 }}
        animate={{ rotate: 12, x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      ></motion.div>
      <motion.div 
        className="absolute bottom-[15%] right-[5%] w-40 h-40 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 -z-5 hidden lg:block"
        initial={{ rotate: -10, x: 50, opacity: 0 }}
        animate={{ rotate: -6, x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      ></motion.div>
      
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
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
      
      <footer className="border-t py-6 bg-background/80 backdrop-blur-sm">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GemMentor - AI-powered study assistant
        </div>
      </footer>
    </div>
  );
}
