import { Link } from "react-router-dom";
import { FlashcardSet } from "@/types";
import { formatDistanceToNow } from "date-fns";

import { Book, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FlashcardSetListProps {
  sets: FlashcardSet[];
}

function FlashcardSetList({ sets }: FlashcardSetListProps) {
  if (sets.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No flashcard sets yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first flashcard set to start studying
        </p>
        <Link to="/create" className="text-primary hover:underline">
          Create flashcard set
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {sets.map((set) => (
        <Link to={`/sets/${set.id}`} key={set.id}>
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{set.title}</CardTitle>
                <Badge variant="outline">{set.category}</Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {set.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm mb-3">
                <Book className="h-4 w-4 mr-1" />
                <span>{set.cardCount} cards</span>
                <Clock className="h-4 w-4 ml-4 mr-1" />
                <span>
                  {set.lastStudied
                    ? `Studied ${formatDistanceToNow(
                        new Date(set.lastStudied),
                        { addSuffix: true }
                      )}`
                    : "Never studied"}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Mastery</span>
                  <span>{set.mastery}%</span>
                </div>
                <Progress value={set.mastery} className="h-1" />
              </div>
            </CardContent>
            <CardFooter className="pt-0 text-xs text-muted-foreground">
              Created
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default FlashcardSetList;
