
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/layouts/MainLayout";
import { StudyStats } from "@/components/StudyStats";
import { FlashcardSetList } from "@/components/FlashcardSetList";
import { FlashcardSet, StudyStats as StudyStatsType } from "@/types";
import { getFlashcardSets, getStudyStats } from "@/services/apiService";
import { Loader2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [stats, setStats] = useState<StudyStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        const [setsData, statsData] = await Promise.all([
          getFlashcardSets(),
          getStudyStats(),
        ]);
        
        setFlashcardSets(setsData);
        setStats(statsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, []);

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
        </div>
      </div>
    </MainLayout>
  );
}
