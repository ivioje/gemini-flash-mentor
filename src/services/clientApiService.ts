
import { Flashcard, FlashcardSet, StudyStats } from "@/types";
import { toast } from "sonner";
import { 
  databases, 
  DATABASES, 
  COLLECTIONS, 
  generateId
} from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import { useAuth, useUser } from "@clerk/clerk-react";

// Helper function to check if the user is authenticated
async function ensureAuthenticated() {
  // We'll use Clerk to check if user is authenticated
  // This is just a placeholder function now, as Clerk's hooks can't be used inside regular functions
  return true;
}

// Get the current user ID from Clerk (to be used inside components)
export function useUserId() {
  const { user } = useUser();
  return user?.id || '';
}

export async function getFlashcardSets(userId: string): Promise<FlashcardSet[]> {
  try {
    // Validate authentication handled by Clerk
    await ensureAuthenticated();
    
    const response = await databases.listDocuments(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARD_SETS,
      [Query.equal("userId", userId)]
    );
    
    const sets = response.documents;
    
    const formattedSets = await Promise.all(sets.map(async (set) => {
      const cardCountResponse = await databases.listDocuments(
        DATABASES.DEFAULT,
        COLLECTIONS.FLASHCARDS,
        [Query.equal("setId", set.$id)]
      );
      
      return {
        id: set.$id,
        title: set.title,
        description: set.description,
        createdAt: set.createdAt,
        lastStudied: set.lastStudied || null,
        cardCount: cardCountResponse.total,
        category: set.category,
        mastery: set.mastery || 0,
      };
    }));
    
    return formattedSets;
  } catch (error) {
    console.error("Error getting flashcard sets:", error);
    toast.error("Failed to fetch flashcard sets");
    return [];
  }
}

export async function getFlashcardSet(id: string): Promise<FlashcardSet | null> {
  try {
    // Validate authentication handled by Clerk
    await ensureAuthenticated();
    
    const set = await databases.getDocument(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARD_SETS,
      id
    );
    
    const cardCountResponse = await databases.listDocuments(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARDS,
      [Query.equal("setId", id)]
    );
    
    return {
      id: set.$id,
      title: set.title,
      description: set.description,
      createdAt: set.createdAt,
      lastStudied: set.lastStudied || null,
      cardCount: cardCountResponse.total,
      category: set.category,
      mastery: set.mastery || 0,
    };
  } catch (error) {
    console.error("Error getting flashcard set:", error);
    toast.error("Failed to fetch flashcard set");
    return null;
  }
}

export async function getFlashcards(setId: string): Promise<Flashcard[]> {
  try {
    // Validate authentication handled by Clerk
    await ensureAuthenticated();
    
    const response = await databases.listDocuments(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARDS,
      [Query.equal("setId", setId)]
    );
    
    return response.documents.map(card => ({
      id: card.$id,
      setId: card.setId,
      question: card.question,
      answer: card.answer,
      lastReviewed: card.lastReviewed || null,
      nextReview: card.nextReview || null,
      ease: card.ease || 2.5,
      interval: card.interval || 1,
      repetitions: card.repetitions || 0,
    }));
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
    // Validate authentication handled by Clerk
    await ensureAuthenticated();
    
    // Create the new flashcard set
    const newSetId = generateId();
    const newSet = await databases.createDocument(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARD_SETS,
      newSetId,
      {
        title,
        description,
        category,
        userId,
        createdAt: new Date().toISOString(),
        mastery: 0
      }
    );
    
    // Create all flashcards in the set
    if (flashcards.length > 0) {
      const createFlashcardsPromises = flashcards.map(card => 
        databases.createDocument(
          DATABASES.DEFAULT,
          COLLECTIONS.FLASHCARDS,
          generateId(),
          {
            question: card.question,
            answer: card.answer,
            setId: newSetId,
            ease: 2.5,
            interval: 1,
            repetitions: 0
          }
        )
      );
      
      await Promise.all(createFlashcardsPromises);
    }
    
    toast.success("Flashcard set created successfully!");
    
    return {
      id: newSet.$id,
      title: newSet.title,
      description: newSet.description,
      createdAt: newSet.createdAt,
      lastStudied: null,
      cardCount: flashcards.length,
      category: newSet.category,
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
    // Validate authentication handled by Clerk
    await ensureAuthenticated();
    
    // Call the API to update the review
    const card = await databases.getDocument(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARDS,
      cardId
    );
    
    // Calculate new values based on SRS algorithm (simplified for client-side)
    const now = new Date();
    let interval = card.interval || 1;
    let repetitions = card.repetitions || 0;
    let ease = card.ease || 2.5;
    
    if (quality >= 3) {
      repetitions++;
      if (repetitions === 1) interval = 1;
      else if (repetitions === 2) interval = 6;
      else interval = Math.round(interval * ease);
      ease = Math.max(1.3, ease + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    } else {
      repetitions = 0;
      interval = 1;
    }
    
    const nextReview = new Date();
    nextReview.setDate(now.getDate() + interval);
    
    await databases.updateDocument(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARDS,
      cardId,
      {
        lastReviewed: now.toISOString(),
        nextReview: nextReview.toISOString(),
        ease,
        interval,
        repetitions
      }
    );
    
    // Update set's last studied time
    await databases.updateDocument(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARD_SETS,
      card.setId,
      { 
        lastStudied: now.toISOString() 
      }
    );
    
  } catch (error) {
    console.error("Error updating flashcard review:", error);
    toast.error("Failed to save your progress");
  }
}

export async function getStudyStats(userId: string): Promise<StudyStats> {
  try {
    // Validate authentication handled by Clerk
    await ensureAuthenticated();
    
    const statsResponse = await databases.listDocuments(
      DATABASES.DEFAULT,
      COLLECTIONS.STUDY_STATS,
      [Query.equal("userId", userId)]
    );
    
    if (statsResponse.total > 0) {
      const stats = statsResponse.documents[0];
      return {
        totalCards: stats.totalCards || 0,
        masteredCards: stats.masteredCards || 0,
        dueCards: stats.dueCards || 0,
        studyStreak: stats.studyStreak || 0,
        totalStudySessions: stats.totalStudySessions || 0,
      };
    }
    
    // Return default stats if none exist
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

// We don't need the auth methods anymore since Clerk handles them
export async function getUser() {
  // This is a placeholder - we'll use Clerk's hooks directly in components
  return null;
}
