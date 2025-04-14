import { StudyStats as StudyStatsType } from "@/types";
import { BookOpen, Calendar, Flame, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudyStatsProps {
  stats: StudyStatsType;
}

export function StudyStats({ stats }: StudyStatsProps) {
  const masteryPercentage =
    stats.totalCards > 0
      ? Math.round((stats.masteredCards / stats.totalCards) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Zap className="h-4 w-4 mr-2 text-yellow-500" />
            Study Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.studyStreak} days</div>
          <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
            Total Cards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCards}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.dueCards} cards due today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Flame className="h-4 w-4 mr-2 text-orange-500" />
            Mastery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{masteryPercentage}%</div>
          <Progress value={masteryPercentage} className="h-2 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-green-500" />
            Study Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStudySessions}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Since you started
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
