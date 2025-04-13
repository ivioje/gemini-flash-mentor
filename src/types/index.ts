
export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  category: string;
  cards?: Flashcard[];
  created_at: Date;
  updated_at: Date;
  user_id: string;
  public?: boolean;
  tags?: string[];
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
