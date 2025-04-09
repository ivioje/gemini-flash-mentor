
import { FlashcardSet, Flashcard, StudyStats } from "@/types";
import { toast } from "sonner";

const API_URL = "/api"; // This would point to your actual backend in production

// These functions will be used in the browser environment
// They make API calls to a backend server that uses Prisma

export async function getFlashcardSets(userId: string): Promise<FlashcardSet[]> {
  try {
    // In a real application, this would be an API call
    // For now, we'll return mock data for demonstration
    console.log("Client API: Getting flashcard sets for user", userId);
    return [];
  } catch (error) {
    console.error("Error getting flashcard sets:", error);
    toast.error("Failed to fetch flashcard sets");
    return [];
  }
}

export async function getFlashcardSet(id: string): Promise<FlashcardSet | null> {
  try {
    console.log("Client API: Getting flashcard set", id);
    return null;
  } catch (error) {
    console.error("Error getting flashcard set:", error);
    toast.error("Failed to fetch flashcard set");
    return null;
  }
}

export async function getFlashcards(setId: string): Promise<Flashcard[]> {
  try {
    console.log("Client API: Getting flashcards for set", setId);
    return [];
  } catch (error) {
    console.error("Error getting flashcards:", error);
    toast.error("Failed to fetch flashcards");
    return [];
  }
}

export async function createFlashcardSet(
  userId: string,
  title: string,
  description: string,
  category: string,
  flashcards: { question: string; answer: string }[]
): Promise<FlashcardSet> {
  try {
    console.log("Client API: Creating flashcard set", { userId, title, category });
    
    // In a real app, this would send a POST request to your backend API
    // For now, we'll return mock data
    return {
      id: "mock-id-" + Date.now(),
      title,
      description,
      createdAt: new Date().toISOString(),
      lastStudied: null,
      cardCount: flashcards.length,
      category,
      mastery: 0,
    };
  } catch (error) {
    console.error("Error creating flashcard set:", error);
    toast.error("Failed to create flashcard set");
    throw new Error("Failed to create flashcard set");
  }
}

export async function updateFlashcardReview(
  cardId: string,
  quality: number
): Promise<void> {
  try {
    console.log("Client API: Updating flashcard review", { cardId, quality });
    // In a real app, this would send a POST/PUT request to your backend
  } catch (error) {
    console.error("Error updating flashcard review:", error);
    toast.error("Failed to save your progress");
  }
}

export async function getStudyStats(userId: string): Promise<StudyStats> {
  try {
    console.log("Client API: Getting study stats for user", userId);
    // Return mock stats
    return {
      totalCards: 0,
      masteredCards: 0,
      dueCards: 0,
      studyStreak: 0,
      totalStudySessions: 0,
    };
  } catch (error) {
    console.error("Error getting study stats:", error);
    return {
      totalCards: 0,
      masteredCards: 0,
      dueCards: 0,
      studyStreak: 0,
      totalStudySessions: 0,
    };
  }
}
