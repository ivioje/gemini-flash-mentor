import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/layouts/MainLayout";
import { Flashcard as FlashcardComponent } from "@/components/Flashcard";
import { Flashcard, FlashcardSet } from "@/index";
import {
  getFlashcardSet,
  getFlashcards,
  updateFlashcardReview,
  updateStudyStats,
} from "@/services/apiService";
import { ArrowLeft, CheckCircle2, LoaderCircle, TimerIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function StudySession() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [set, setSet] = useState<FlashcardSet | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id || !user) return;

      try {
        setIsLoading(true);
        const [setData, cardsData] = await Promise.all([
          getFlashcardSet(id),
          getFlashcards(id),
        ]);

        if (!setData) {
          toast.error("Flashcard set not found");
          navigate("/dashboard");
          return;
        }

        setSet(setData);

        // Sort cards by due date (null ones at the end)
        const sortedCards = cardsData.sort((a, b) => {
          if (!a.nextReview) return 1;
          if (!b.nextReview) return -1;
          return (
            new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()
          );
        });

        setFlashcards(sortedCards);
        setSessionStartTime(new Date());
      } catch (error) {
        console.error("Error loading study session:", error);
        toast.error("Failed to load study session");
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadData();
    }
  }, [id, navigate, user]);

  const handleRating = async (quality: number) => {
    try {
      if (!flashcards[currentCardIndex] || !user) return;

      await updateFlashcardReview(flashcards[currentCardIndex].id, quality);
      setReviewedCount((prev) => prev + 1);

      // Check if this was the last card
      const isLastCard = currentCardIndex >= flashcards.length - 1;

      // If it's the last card, update stats before advancing
      if (isLastCard) {
        const sessionDuration = sessionStartTime
          ? Math.floor((Date.now() - sessionStartTime.getTime()) / 1000)
          : 0;

        try {
          await updateStudyStats(user.$id, {
            duration: sessionDuration,
            cardsStudied: flashcards.length,
            setId: id as string,
          });

          toast.success(
            `Study session completed! You've studied ${
              flashcards.length
            } cards in ${formatTime(sessionDuration)}`
          );
        } catch (error) {
          console.error("Error saving study session:", error);
          toast.error("Failed to save your study session");
        }
      }

      // Always advance to next card (this will trigger the completed UI if it was the last card)
      setCurrentCardIndex((prev) => prev + 1);
    } catch (error) {
      console.error("Error handling rating:", error);
      toast.error("Failed to handle rating");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getElapsedTime = () => {
    if (!sessionStartTime) return "00:00";
    const elapsedSeconds = Math.floor(
      (Date.now() - sessionStartTime.getTime()) / 1000
    );
    return formatTime(elapsedSeconds);
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

  if (!set || flashcards.length === 0) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No cards to study</h2>
          <p className="mb-6">This set doesn't have any flashcards yet.</p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const progress = (reviewedCount / flashcards.length) * 100;
  const isSessionComplete = reviewedCount >= flashcards.length;

  return (
    <MainLayout>
      <div className="mb-6">
        <Link
          to={`/sets/${id}`}
          className="text-muted-foreground hover:text-foreground flex items-center mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Set
        </Link>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Studying: {set.title}</h1>
            <div className="flex items-center text-sm">
              <TimerIcon className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{getElapsedTime()}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-1 text-sm">
            <span>Progress</span>
            <span>
              {reviewedCount} of {flashcards.length} cards
            </span>
          </div>
          <Progress value={progress} className="h-2 mb-6" />
        </div>

        {!isSessionComplete ? (
          <FlashcardComponent
            flashcard={flashcards[currentCardIndex]}
            onRating={handleRating}
          />
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
            <p className="mb-6 text-muted-foreground">
              You've completed all {flashcards.length} cards in this study
              session.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" asChild>
                <Link to={`/sets/${id}`}>Back to Set</Link>
              </Button>
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
