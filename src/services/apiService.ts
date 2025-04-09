
import { toast } from "sonner";
import { 
  databases, 
  DATABASES, 
  COLLECTIONS, 
  generateId, 
  getCurrentUser 
} from "@/lib/appwrite";
import { Flashcard, FlashcardSet, StudyStats } from "@/types";
import { ID, Query } from "appwrite";

// Helper to update spaced repetition data
function calculateNextReview(quality: number, previousInterval: number, previousEase: number, repetitions: number): {
  nextReviewDate: Date,
  ease: number,
  interval: number,
  repetitions: number
} {
  // Implementation of SuperMemo-2 algorithm
  let ease = previousEase;
  let interval = previousInterval;
  let newRepetitions = repetitions;
  
  // Adjust ease factor based on performance (0-5 scale)
  if (quality < 3) {
    // Reset if incorrect
    newRepetitions = 0;
    interval = 1;
  } else {
    // Correct response
    newRepetitions += 1;
    
    // Adjust ease factor (min 1.3)
    ease = Math.max(1.3, ease + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // Calculate interval
    if (newRepetitions === 1) {
      interval = 1;
    } else if (newRepetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease);
    }
  }
  
  // Calculate next review date
  const now = new Date();
  const nextReviewDate = new Date();
  nextReviewDate.setDate(now.getDate() + interval);
  
  return { 
    nextReviewDate,
    ease,
    interval,
    repetitions: newRepetitions
  };
}

export async function getFlashcardSets(userId: string): Promise<FlashcardSet[]> {
  try {
    const response = await databases.listDocuments(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARD_SETS,
      [Query.equal("userId", userId)]
    );
    
    const sets = response.documents;
    
    const formattedSets = await Promise.all(sets.map(async (set) => {
      // Count cards for this set
      const cardCountResponse = await databases.listDocuments(
        DATABASES.DEFAULT,
        COLLECTIONS.FLASHCARDS,
        [Query.equal("setId", set.$id)]
      );
      
      const cardCount = cardCountResponse.total;
      
      return {
        id: set.$id,
        title: set.title,
        description: set.description,
        createdAt: set.createdAt,
        lastStudied: set.lastStudied || null,
        cardCount,
        category: set.category,
        mastery: set.mastery || 0,
      };
    }));
    
    return formattedSets;
  } catch (error) {
    console.error("Error getting flashcard sets:", error);
    throw new Error("Failed to fetch flashcard sets");
  }
}

export async function getFlashcardSet(id: string): Promise<FlashcardSet | null> {
  try {
    const set = await databases.getDocument(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARD_SETS,
      id
    );
    
    if (!set) return null;
    
    // Count cards for this set
    const cardCountResponse = await databases.listDocuments(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARDS,
      [Query.equal("setId", id)]
    );
    
    const cardCount = cardCountResponse.total;
    
    return {
      id: set.$id,
      title: set.title,
      description: set.description,
      createdAt: set.createdAt,
      lastStudied: set.lastStudied || null,
      cardCount,
      category: set.category,
      mastery: set.mastery || 0,
    };
  } catch (error) {
    console.error("Error getting flashcard set:", error);
    throw new Error("Failed to fetch flashcard set");
  }
}

export async function getFlashcards(setId: string): Promise<Flashcard[]> {
  try {
    const response = await databases.listDocuments(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARDS,
      [Query.equal("setId", setId)]
    );
    
    const cards = response.documents;
    
    return cards.map(card => ({
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
    throw new Error("Failed to fetch flashcards");
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
      
      // Update or create user's study stats
      const statsResponse = await databases.listDocuments(
        DATABASES.DEFAULT,
        COLLECTIONS.STUDY_STATS,
        [Query.equal("userId", userId)]
      );
      
      if (statsResponse.total > 0) {
        const stats = statsResponse.documents[0];
        await databases.updateDocument(
          DATABASES.DEFAULT,
          COLLECTIONS.STUDY_STATS,
          stats.$id,
          {
            totalCards: (stats.totalCards || 0) + flashcards.length
          }
        );
      } else {
        await databases.createDocument(
          DATABASES.DEFAULT,
          COLLECTIONS.STUDY_STATS,
          generateId(),
          {
            userId,
            totalCards: flashcards.length,
            masteredCards: 0,
            dueCards: 0,
            studyStreak: 0,
            totalStudySessions: 0,
            lastStudyDate: null
          }
        );
      }
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
  quality: number // 0-5 rating of how well the user recalled the answer
): Promise<void> {
  try {
    // Get the current card
    const card = await databases.getDocument(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARDS,
      cardId
    );
    
    if (!card) {
      throw new Error("Card not found");
    }
    
    // Get the set information
    const set = await databases.getDocument(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARD_SETS,
      card.setId
    );
    
    // Calculate next review details using spaced repetition algorithm
    const { nextReviewDate, ease, interval, repetitions } = calculateNextReview(
      quality, 
      card.interval || 1, 
      card.ease || 2.5, 
      card.repetitions || 0
    );
    
    // Update the flashcard
    await databases.updateDocument(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARDS,
      cardId,
      {
        lastReviewed: new Date().toISOString(),
        nextReview: nextReviewDate.toISOString(),
        ease,
        interval,
        repetitions,
      }
    );
    
    // Update the set's lastStudied date
    await databases.updateDocument(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARD_SETS,
      card.setId,
      { 
        lastStudied: new Date().toISOString() 
      }
    );
    
    // Update mastery for the set
    await updateSetMastery(card.setId);
    
    // Update user study streak
    await updateStudyStreak(set.userId);
    
    if (quality >= 3) {
      toast("Good job! You're making progress.");
    } else {
      toast("Keep practicing! You'll get it next time.");
    }
  } catch (error) {
    console.error("Error updating flashcard review:", error);
    toast.error("Failed to save your progress");
  }
}

async function updateSetMastery(setId: string): Promise<void> {
  try {
    const cardsResponse = await databases.listDocuments(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARDS,
      [Query.equal("setId", setId)]
    );
    
    const allCards = cardsResponse.documents;
    
    if (allCards.length === 0) return;
    
    // Consider a card mastered if it has repetitions >= 3 and last review was successful
    const masteredCards = allCards.filter(card => (card.repetitions || 0) >= 3);
    const masteryPercentage = Math.round((masteredCards.length / allCards.length) * 100);
    
    await databases.updateDocument(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARD_SETS,
      setId,
      { 
        mastery: masteryPercentage 
      }
    );
    
    // Get the set to find the user ID
    const set = await databases.getDocument(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARD_SETS,
      setId
    );
    
    if (set) {
      await updateUserMasteredCards(set.userId);
    }
  } catch (error) {
    console.error("Error updating set mastery:", error);
  }
}

async function updateUserMasteredCards(userId: string): Promise<void> {
  try {
    // Get all flashcard sets for this user
    const setsResponse = await databases.listDocuments(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARD_SETS,
      [Query.equal("userId", userId)]
    );
    
    const setIds = setsResponse.documents.map(set => set.$id);
    
    // Count all cards by this user
    let totalCards = 0;
    let masteredCards = 0;
    let dueCards = 0;
    const now = new Date();
    
    for (const setId of setIds) {
      const cardsResponse = await databases.listDocuments(
        DATABASES.DEFAULT,
        COLLECTIONS.FLASHCARDS,
        [Query.equal("setId", setId)]
      );
      
      const cards = cardsResponse.documents;
      totalCards += cards.length;
      
      // Count mastered cards
      masteredCards += cards.filter(card => (card.repetitions || 0) >= 3).length;
      
      // Count due cards (those with nextReview date today or earlier)
      dueCards += cards.filter(card => {
        if (!card.nextReview) return true; // Cards never reviewed are due
        return new Date(card.nextReview) <= now;
      }).length;
    }
    
    // Update or create study stats
    const statsResponse = await databases.listDocuments(
      DATABASES.DEFAULT,
      COLLECTIONS.STUDY_STATS,
      [Query.equal("userId", userId)]
    );
    
    if (statsResponse.total > 0) {
      const stats = statsResponse.documents[0];
      await databases.updateDocument(
        DATABASES.DEFAULT,
        COLLECTIONS.STUDY_STATS,
        stats.$id,
        {
          totalCards,
          masteredCards,
          dueCards
        }
      );
    } else {
      await databases.createDocument(
        DATABASES.DEFAULT,
        COLLECTIONS.STUDY_STATS,
        generateId(),
        {
          userId,
          totalCards,
          masteredCards,
          dueCards,
          studyStreak: 0,
          totalStudySessions: 0,
          lastStudyDate: null
        }
      );
    }
  } catch (error) {
    console.error("Error updating user mastered cards:", error);
  }
}

async function updateStudyStreak(userId: string): Promise<void> {
  try {
    // Get the user's current stats
    const statsResponse = await databases.listDocuments(
      DATABASES.DEFAULT,
      COLLECTIONS.STUDY_STATS,
      [Query.equal("userId", userId)]
    );
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // If no stats exist yet, create with streak of 1
    if (statsResponse.total === 0) {
      await databases.createDocument(
        DATABASES.DEFAULT,
        COLLECTIONS.STUDY_STATS,
        generateId(),
        {
          userId,
          studyStreak: 1,
          lastStudyDate: new Date().toISOString(),
          totalStudySessions: 1,
          totalCards: 0,
          masteredCards: 0,
          dueCards: 0
        }
      );
      return;
    }
    
    const stats = statsResponse.documents[0];
    
    const lastStudy = stats.lastStudyDate ? new Date(stats.lastStudyDate) : null;
    if (lastStudy) {
      lastStudy.setHours(0, 0, 0, 0);
    }
    
    let streak = stats.studyStreak || 0;
    
    // If they already studied today, don't increment the streak or sessions
    if (lastStudy && lastStudy.getTime() === today.getTime()) {
      // Already studied today, do nothing
      return;
    } 
    // If they studied yesterday, increment the streak
    else if (lastStudy && lastStudy.getTime() === yesterday.getTime()) {
      streak += 1;
    } 
    // If they didn't study yesterday, reset the streak to 1
    else {
      streak = 1;
    }
    
    // Update the study stats
    await databases.updateDocument(
      DATABASES.DEFAULT,
      COLLECTIONS.STUDY_STATS,
      stats.$id,
      {
        studyStreak: streak,
        lastStudyDate: new Date().toISOString(),
        totalStudySessions: (stats.totalStudySessions || 0) + 1
      }
    );
  } catch (error) {
    console.error("Error updating study streak:", error);
  }
}

export async function getStudyStats(userId: string): Promise<StudyStats> {
  try {
    // Get user stats or create if they don't exist
    const statsResponse = await databases.listDocuments(
      DATABASES.DEFAULT,
      COLLECTIONS.STUDY_STATS,
      [Query.equal("userId", userId)]
    );
    
    let stats;
    
    if (statsResponse.total === 0) {
      // Create new stats document
      stats = await databases.createDocument(
        DATABASES.DEFAULT,
        COLLECTIONS.STUDY_STATS,
        generateId(),
        {
          userId,
          totalCards: 0,
          masteredCards: 0,
          dueCards: 0,
          studyStreak: 0,
          totalStudySessions: 0,
          lastStudyDate: null
        }
      );
    } else {
      stats = statsResponse.documents[0];
    }
    
    // Count due cards which could change daily
    let dueCards = 0;
    const now = new Date();
    
    // Get all flashcard sets for this user
    const setsResponse = await databases.listDocuments(
      DATABASES.DEFAULT,
      COLLECTIONS.FLASHCARD_SETS,
      [Query.equal("userId", userId)]
    );
    
    const setIds = setsResponse.documents.map(set => set.$id);
    
    for (const setId of setIds) {
      const cardsResponse = await databases.listDocuments(
        DATABASES.DEFAULT,
        COLLECTIONS.FLASHCARDS,
        [Query.equal("setId", setId)]
      );
      
      dueCards += cardsResponse.documents.filter(card => {
        if (!card.nextReview) return true; // Cards never reviewed are due
        return new Date(card.nextReview) <= now;
      }).length;
    }
    
    // Update due cards count if it has changed
    if (dueCards !== (stats.dueCards || 0)) {
      await databases.updateDocument(
        DATABASES.DEFAULT,
        COLLECTIONS.STUDY_STATS,
        stats.$id,
        { dueCards }
      );
      stats.dueCards = dueCards;
    }
    
    return {
      totalCards: stats.totalCards || 0,
      masteredCards: stats.masteredCards || 0,
      dueCards: stats.dueCards || 0,
      studyStreak: stats.studyStreak || 0,
      totalStudySessions: stats.totalStudySessions || 0,
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
