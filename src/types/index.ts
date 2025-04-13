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
  // Add these properties to match what's used in components
  cardCount?: number;
  lastStudied?: string | null;
  mastery?: number;
  createdAt?: string; // For backward compatibility
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

// User type (for auth)
export interface User {
  $id: string;
  name: string;
  email: string;
}
