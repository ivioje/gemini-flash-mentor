
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Testimonials } from "@/components/Testimonials";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b p-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-foreground">GemMentor</h1>
          </div>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-24 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Learn Faster with AI-Powered Flashcards
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  GemMentor uses AI to help you create effective flashcards and optimize your study sessions with spaced repetition for maximum retention.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {!isAuthenticated ? (
                    <>
                      <Button size="lg" asChild>
                        <Link to="/sign-up">Get Started</Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link to="/sign-in">Sign In</Link>
                      </Button>
                    </>
                  ) : (
                    <Button size="lg" asChild>
                      <Link to="/dashboard">Go to Dashboard</Link>
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg"
                  width={550}
                  height={400}
                  alt="Hero image"
                  className="rounded-lg object-cover border shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-muted/30">
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
        
        <section className="py-24 bg-primary text-primary-foreground">
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
