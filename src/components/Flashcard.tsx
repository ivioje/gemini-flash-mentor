
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flashcard as FlashcardType } from "@/types";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

interface FlashcardProps {
  flashcard: FlashcardType;
  onRating?: (quality: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}

export function Flashcard({
  flashcard,
  onRating,
  onNext,
  onPrevious,
  showNavigation = false
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRating = (quality: number) => {
    if (onRating) {
      onRating(quality);
      // After rating, show the next card
      setIsFlipped(false);
      if (onNext) {
        setTimeout(() => {
          onNext();
        }, 300);
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="card-flip h-64 sm:h-80 md:h-96 mb-4">
        <div className={`card-flip-inner relative h-full w-full ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          {/* Front side - Question */}
          <Card className="card-flip-front h-full flex flex-col">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <h3 className="text-xl font-medium mb-2 text-center">Question</h3>
              <p className="text-lg text-center">{flashcard.question}</p>
              <Button
                variant="ghost"
                className="mt-auto text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
              >
                Click to reveal answer
              </Button>
            </CardContent>
          </Card>

          {/* Back side - Answer */}
          <Card className="card-flip-back h-full flex flex-col">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <h3 className="text-xl font-medium mb-2 text-center">Answer</h3>
              <p className="text-base text-center overflow-auto">{flashcard.answer}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation buttons */}
      {showNavigation && (
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!onPrevious}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsFlipped(false)}
            className="mx-2"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Flip
          </Button>

          <Button
            variant="outline"
            onClick={onNext}
            disabled={!onNext}
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Rating buttons - only show when card is flipped and onRating is provided */}
      {isFlipped && onRating && (
        <div className="mt-4">
          <h4 className="text-center mb-2 text-sm text-muted-foreground">How well did you know this?</h4>
          <div className="flex justify-center space-x-2">
            <Button variant="destructive" size="sm" onClick={() => handleRating(0)}>
              Not at all
            </Button>
            <Button variant="default" size="sm" className="bg-amber-500 hover:bg-amber-600" onClick={() => handleRating(3)}>
              Somewhat
            </Button>
            <Button variant="default" size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handleRating(5)}>
              Perfectly
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
