
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/layouts/MainLayout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ArrowRight, BookOpen, Brain, Stars, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <ThemeProvider>
      <MainLayout>
        {/* Hero Section */}
        <section className="py-10 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                    Master Any Subject with AI-Powered Flashcards
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    GemMentor helps you create, study, and master flashcards with the help of advanced AI. Study smarter, not harder.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link to="/dashboard">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center p-4">
                <div className="relative w-full">
                  <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] md:h-[450px] md:w-[450px] mx-auto">
                    {/* Placeholder for hero image or animation */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse">
                      <BookOpen className="h-32 w-32 text-primary opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="mb-8 md:mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Features that Make Learning Easier
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                GemMentor combines the power of spaced repetition with AI-generated content.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI-Powered Content</h3>
                <p className="mt-2 text-muted-foreground">
                  Generate high-quality flashcards on any topic with our Gemini-powered AI assistant.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Spaced Repetition</h3>
                <p className="mt-2 text-muted-foreground">
                  Our algorithm remembers what you struggle with and helps you review at the perfect time.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Stars className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Progress Tracking</h3>
                <p className="mt-2 text-muted-foreground">
                  See your improvement over time with detailed statistics and mastery tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Ready to Transform Your Study Sessions?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Join thousands of students who are already using GemMentor to ace their exams.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link to="/dashboard">Create Your First Set</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </MainLayout>
    </ThemeProvider>
  );
}
