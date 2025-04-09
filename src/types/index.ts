
export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  lastStudied: string | null;
  cardCount: number;
  category: string;
  mastery: number;
}

export interface Flashcard {
  id: string;
  setId: string;
  question: string;
  answer: string;
  lastReviewed: string | null;
  nextReview: string | null;
  ease: number;
  interval: number;
  repetitions: number;
}

export interface StudyStats {
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  studyStreak: number;
  totalStudySessions: number;
}
