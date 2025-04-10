
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Testimonials } from "@/components/Testimonials";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Index() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Navigation />
      <main className="flex-1">
        <section className="py-20 md:py-28 relative overflow-hidden">
          {/* Glassmorphism background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_700px_at_50%_40%,rgba(var(--primary),0.15),transparent)] -z-10"></div>
          <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-background to-transparent -z-10"></div>
          
          {/* Glass card decorative elements */}
          <div className="absolute top-[15%] left-[5%] w-32 h-32 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 rotate-12 hidden lg:block"></div>
          <div className="absolute bottom-[15%] right-[5%] w-40 h-40 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 -rotate-6 hidden lg:block"></div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  AI-powered learning
                </div>
                <motion.h1 
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Learn Faster with AI-Powered Flashcards
                </motion.h1>
                <motion.p 
                  className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  GemMentor uses AI to help you create effective flashcards and optimize your study sessions with spaced repetition for maximum retention.
                </motion.p>
                <motion.div 
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {!isAuthenticated ? (
                    <>
                      <Button size="lg" className="bg-primary text-white hover:bg-primary/90 group" asChild>
                        <Link to="/sign-up">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link to="/sign-in">Sign In</Link>
                      </Button>
                    </>
                  ) : (
                    <Button size="lg" className="bg-primary text-white hover:bg-primary/90 group" asChild>
                      <Link to="/dashboard">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  )}
                </motion.div>
              </div>
              
              {/* Animated Flashcards Hero Illustration */}
              <motion.div 
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
              >
                <div className="relative w-full max-w-md h-[380px]">
                  {/* Flashcard stack animation */}
                  <motion.div 
                    className="absolute top-10 right-12 w-64 h-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-border/40 z-10 p-4 flex flex-col justify-between"
                    initial={{ x: -20, y: 20, rotate: -5 }}
                    animate={{ x: 0, y: 0, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                  >
                    <h3 className="font-semibold text-primary">What is spaced repetition?</h3>
                    <div className="mt-auto flex justify-end">
                      <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute top-4 right-8 w-64 h-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-border/40 z-20 p-4 flex flex-col justify-between"
                    initial={{ rotate: 6 }}
                    animate={{ rotate: 3 }}
                    transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
                  >
                    <h3 className="font-semibold text-primary">How does the memory curve work?</h3>
                    <div className="mt-auto flex justify-end">
                      <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute top-0 right-0 w-64 h-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-border/40 z-30 p-4 flex flex-col justify-between"
                    initial={{ rotate: -4 }}
                    animate={{ rotate: -2 }}
                    transition={{ duration: 0.7, delay: 0.5, type: "spring" }}
                  >
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-primary">AI-generated explanations</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Learn at your optimal pace with intelligent flashcards
                    </p>
                    <div className="mt-auto flex justify-end">
                      <motion.div 
                        className="w-8 h-1 bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: 32 }}
                        transition={{ duration: 1, delay: 1 }}
                      ></motion.div>
                    </div>
                  </motion.div>
                  
                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl backdrop-blur-[2px] z-0"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary),0.05),transparent)] -z-10"></div>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 21h5v-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Spaced Repetition</h3>
                <p className="text-muted-foreground">
                  Optimize your learning with scientifically-proven methods that ensure maximum retention
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 8V4H8" />
                    <rect height="12" width="16" x="4" y="8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">AI-Generated Flashcards</h3>
                <p className="text-muted-foreground">
                  Let our AI create high-quality flashcards for any topic in seconds
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2v8" />
                    <path d="m4.93 10.93 1.41 1.41" />
                    <path d="M2 18h2" />
                    <path d="M20 18h2" />
                    <path d="m19.07 10.93-1.41 1.41" />
                    <path d="M22 22H2" />
                    <path d="m8 22 4-11 4 11" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor your study habits and track your mastery with detailed statistics
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <Testimonials />
        
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 -z-10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.1),transparent)] -z-10"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Start Learning Smarter Today
                </h2>
                <p className="mx-auto max-w-[700px] text-primary-foreground/90 md:text-xl">
                  Join thousands of students who are already using GemMentor to improve their study efficiency.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                {!isAuthenticated ? (
                  <Button size="lg" className="w-full bg-background text-primary hover:bg-background/90" asChild>
                    <Link to="/sign-up">Sign Up For Free</Link>
                  </Button>
                ) : (
                  <Button size="lg" className="w-full bg-background text-primary hover:bg-background/90" asChild>
                    <Link to="/dashboard">Go to Dashboard</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col gap-4 md:h-24 md:flex-row md:items-center">
          <p className="text-sm text-muted-foreground md:text-center">
            &copy; {new Date().getFullYear()} GemMentor. All rights reserved.
          </p>
          <nav className="md:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm text-muted-foreground hover:underline underline-offset-4" to="/">
              Terms of Service
            </Link>
            <Link className="text-sm text-muted-foreground hover:underline underline-offset-4" to="/">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
