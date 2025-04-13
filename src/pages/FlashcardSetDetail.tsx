
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MainLayout } from "@/layouts/MainLayout";
import { Flashcard as FlashcardComponent } from "@/components/Flashcard";
import { Flashcard, FlashcardSet } from "@/types";
import { getFlashcardSet, getFlashcards } from "@/services/clientApiService";
import { ArrowLeft, BookOpen, Clock, LoaderCircle, Share } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function FlashcardSetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [set, setSet] = useState<FlashcardSet | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const [setData, cardsData] = await Promise.all([
          getFlashcardSet(id),
          getFlashcards(id)
        ]);
        
        if (!setData) {
          navigate("/dashboard");
          return;
        }
        
        setSet(setData);
        setFlashcards(cardsData);
      } catch (error) {
        console.error("Error loading flashcard set:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [id, navigate]);

  const handlePreviousCard = () => {
    setCurrentCardIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextCard = () => {
    setCurrentCardIndex(prev => Math.min(flashcards.length - 1, prev + 1));
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!set) {
    return null;
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{set.title}</h1>
              <Badge variant="outline">{set.category}</Badge>
            </div>
            <p className="text-muted-foreground mb-2">{set.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{set.cardCount} cards</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {set.lastStudied
                    ? `Studied ${formatDistanceToNow(new Date(set.lastStudied), {
                        addSuffix: true,
                      })}`
                    : "Never studied"}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 self-start">
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button asChild>
              <Link to={`/study/${id}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Study Now
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Mastery Level</span>
            <span>{set.mastery}%</span>
          </div>
          <Progress value={set.mastery} className="h-2" />
        </div>
        
        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview Cards</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4">
            {flashcards.length > 0 ? (
              <div className="max-w-xl mx-auto">
                <FlashcardComponent
                  flashcard={flashcards[currentCardIndex]}
                  onNext={currentCardIndex < flashcards.length - 1 ? handleNextCard : undefined}
                  onPrevious={currentCardIndex > 0 ? handlePreviousCard : undefined}
                  showNavigation={true}
                />
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Card {currentCardIndex + 1} of {flashcards.length}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p>This flashcard set has no cards yet.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="list" className="mt-4">
            {flashcards.length > 0 ? (
              <div className="space-y-4">
                {flashcards.map((card, index) => (
                  <Card key={card.id} className="p-4">
                    <div className="mb-2">
                      <h3 className="font-medium">Question {index + 1}</h3>
                      <p>{card.question}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Answer</h3>
                      <p>{card.answer}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p>This flashcard set has no cards yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
