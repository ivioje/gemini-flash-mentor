
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/layouts/MainLayout";
import { StudyStats } from "@/components/StudyStats";
import { FlashcardSetList } from "@/components/FlashcardSetList";
import { FlashcardSet, StudyStats as StudyStatsType } from "@/types";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

// Import from our refactored services
import { getFlashcardSets, getStudyStats } from "@/services/clientApiService";

export default function Dashboard() {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [stats, setStats] = useState<StudyStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const [setsData, statsData] = await Promise.all([
          getFlashcardSets(user.$id),
          getStudyStats(user.$id),
        ]);
        
        setFlashcardSets(setsData);
        setStats(statsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load your dashboard data");
      } finally {
        setIsLoading(false);
      }
    }
    
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button asChild>
            <Link to="/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Set
            </Link>
          </Button>
        </div>
        
        {stats && <StudyStats stats={stats} />}
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Flashcard Sets</h2>
          </div>
          <FlashcardSetList sets={flashcardSets} />
          
          {flashcardSets.length === 0 && (
            <div className="text-center py-10 border rounded-lg">
              <h3 className="text-xl mb-2">No flashcard sets yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first flashcard set to start studying
              </p>
              <Button asChild>
                <Link to="/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Set
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
