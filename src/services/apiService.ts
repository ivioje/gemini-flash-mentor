
// This is a stub service - will be replaced with actual Supabase implementation
// after Supabase integration is connected by the user

import { toast } from "sonner";

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

// Temporary mock data
const mockFlashcardSets: FlashcardSet[] = [
  {
    id: "1",
    title: "Introduction to Biology",
    description: "Basic concepts of cellular biology and genetics",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastStudied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    cardCount: 15,
    category: "Science",
    mastery: 65,
  },
  {
    id: "2",
    title: "World History: Renaissance",
    description: "Key events and figures of the Renaissance period",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastStudied: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    cardCount: 23,
    category: "History",
    mastery: 42,
  },
  {
    id: "3",
    title: "Calculus Fundamentals",
    description: "Derivatives, integrals and limits",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastStudied: null,
    cardCount: 30,
    category: "Mathematics",
    mastery: 0,
  },
];

const mockFlashcards: Record<string, Flashcard[]> = {
  "1": [
    {
      id: "101",
      setId: "1",
      question: "What is the powerhouse of the cell?",
      answer: "The mitochondria is the powerhouse of the cell, responsible for producing energy in the form of ATP through cellular respiration.",
      lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      nextReview: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      ease: 2.5,
      interval: 2,
      repetitions: 3,
    },
    {
      id: "102",
      setId: "1",
      question: "What are the four nucleotide bases in DNA?",
      answer: "The four nucleotide bases in DNA are Adenine (A), Thymine (T), Guanine (G), and Cytosine (C). A pairs with T, and G pairs with C.",
      lastReviewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      nextReview: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      ease: 2.2,
      interval: 4,
      repetitions: 2,
    },
    // More flashcards would be here
  ],
  "2": [
    {
      id: "201",
      setId: "2",
      question: "When did the Renaissance period begin?",
      answer: "The Renaissance began in the 14th century in Italy, specifically Florence, and spread throughout Europe during the 15th and 16th centuries.",
      lastReviewed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      nextReview: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      ease: 2.1,
      interval: 1,
      repetitions: 2,
    },
    // More flashcards would be here
  ],
};

const mockStats: StudyStats = {
  totalCards: 68,
  masteredCards: 23,
  dueCards: 12,
  studyStreak: 5,
  totalStudySessions: 24,
};

// API functions - will connect to Supabase later
export async function getFlashcardSets(): Promise<FlashcardSet[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockFlashcardSets;
}

export async function getFlashcardSet(id: string): Promise<FlashcardSet | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockFlashcardSets.find(set => set.id === id) || null;
}

export async function getFlashcards(setId: string): Promise<Flashcard[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockFlashcards[setId] || [];
}

export async function createFlashcardSet(
  title: string,
  description: string,
  category: string,
  flashcards: { question: string; answer: string }[]
): Promise<FlashcardSet> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newSetId = String(Date.now());
  const newSet: FlashcardSet = {
    id: newSetId,
    title,
    description,
    createdAt: new Date().toISOString(),
    lastStudied: null,
    cardCount: flashcards.length,
    category,
    mastery: 0,
  };
  
  // In a real app, we'd save to Supabase here
  mockFlashcardSets.push(newSet);
  
  // Create flashcards in the set
  mockFlashcards[newSetId] = flashcards.map((card, index) => ({
    id: `${newSetId}-${index}`,
    setId: newSetId,
    question: card.question,
    answer: card.answer,
    lastReviewed: null,
    nextReview: null,
    ease: 2.5, // Initial ease factor
    interval: 0,
    repetitions: 0,
  }));

  toast.success("Flashcard set created successfully!");
  return newSet;
}

export async function updateFlashcardReview(
  cardId: string,
  quality: number // 0-5 rating of how well the user recalled the answer
): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app with Supabase, we'd update the flashcard review data
  // using a spaced repetition algorithm like SM-2

  // For now, just show a toast notification
  if (quality >= 3) {
    toast("Good job! You're making progress.");
  } else {
    toast("Keep practicing! You'll get it next time.");
  }
}

export async function getStudyStats(): Promise<StudyStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 350));
  return mockStats;
}
