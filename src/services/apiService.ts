
import { Flashcard, FlashcardSet, StudyStats } from "@/types";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where 
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

// Get the current user ID
export function useUserId() {
  const { user } = useAuth();
  return user?.$id || '';
}

// Helper function to convert data to our app's data model
const convertFlashcardSet = (rawData: any): FlashcardSet => {
  return {
    id: rawData.id,
    title: rawData.title,
    description: rawData.description,
    category: rawData.category || 'General',
    created_at: rawData.created_at ? new Date(rawData.created_at) : new Date(),
    updated_at: rawData.updated_at ? new Date(rawData.updated_at) : new Date(),
    user_id: rawData.user_id || '',
    public: rawData.public || false,
    tags: rawData.tags || [],
    cardCount: rawData.cardCount || 0,
    lastStudied: rawData.lastStudied || null,
    mastery: rawData.mastery || 0,
  };
};

// Function to get all flashcard sets for a user
export async function getFlashcardSets(userId: string): Promise<FlashcardSet[]> {
  try {
    // Simulate API call
    const data = [
      {
        id: '1',
        title: 'JavaScript Basics',
        description: 'Fundamental concepts of JavaScript',
        category: 'Programming',
        created_at: new Date(),
        updated_at: new Date(),
        user_id: userId,
        public: true,
        tags: ['programming', 'javascript'],
        cardCount: 25,
        lastStudied: '2023-04-01T10:30:00Z',
        mastery: 75
      },
      {
        id: '2',
        title: 'React Hooks',
        description: 'Understanding React Hooks',
        category: 'Programming',
        created_at: new Date(),
        updated_at: new Date(),
        user_id: userId,
        public: true,
        tags: ['programming', 'react'],
        cardCount: 15,
        lastStudied: '2023-04-05T14:20:00Z',
        mastery: 60
      }
    ];
    
    return data;
  } catch (error) {
    console.error("Error getting flashcard sets:", error);
    toast.error("Failed to fetch flashcard sets");
    return [];
  }
}

// Get a specific flashcard set by ID
export async function getFlashcardSet(id: string): Promise<FlashcardSet | null> {
  try {
    // Simulate API call
    return {
      id: id,
      title: 'JavaScript Basics',
      description: 'Fundamental concepts of JavaScript',
      category: 'Programming',
      created_at: new Date(),
      updated_at: new Date(),
      user_id: 'user123',
      public: true,
      tags: ['programming', 'javascript'],
      cardCount: 25,
      lastStudied: '2023-04-01T10:30:00Z',
      mastery: 75
    };
  } catch (error) {
    console.error("Error getting flashcard set:", error);
    toast.error("Failed to fetch flashcard set");
    return null;
  }
}

// Get flashcards for a specific set
export async function getFlashcards(setId: string): Promise<Flashcard[]> {
  try {
    // Simulate API call
    return [
      {
        id: '1',
        setId: setId,
        question: 'What is JavaScript?',
        answer: 'JavaScript is a scripting language used to create and control dynamic website content.',
        lastReviewed: null,
        nextReview: null,
        ease: 2.5,
        interval: 1,
        repetitions: 0
      },
      {
        id: '2',
        setId: setId,
        question: 'What are variables?',
        answer: 'Variables are containers for storing data values.',
        lastReviewed: null,
        nextReview: null,
        ease: 2.5,
        interval: 1,
        repetitions: 0
      }
    ];
  } catch (error) {
    console.error("Error getting flashcards:", error);
    toast.error("Failed to fetch flashcards");
    return [];
  }
}

// Create a new flashcard set
export async function createFlashcardSet(
  userId: string,
  title: string,
  description: string,
  category: string,
  flashcards: { question: string; answer: string }[]
): Promise<FlashcardSet> {
  try {
    // Simulate API call
    const newSet: FlashcardSet = {
      id: 'new-id-' + Math.random().toString(36).substring(2, 9),
      title,
      description,
      category,
      created_at: new Date(),
      updated_at: new Date(),
      user_id: userId,
      public: false,
      tags: [],
      cardCount: flashcards.length,
      lastStudied: null,
      mastery: 0
    };
    
    toast.success("Flashcard set created successfully!");
    return newSet;
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
    // Get the current card
    const cardRef = doc(db, "flashcards", cardId);
    const cardSnap = await getDoc(cardRef);
    
    if (!cardSnap.exists()) {
      throw new Error("Card not found");
    }
    
    const cardData = cardSnap.data();
    
    // Calculate new values based on SRS algorithm (simplified for client-side)
    const now = new Date();
    let interval = cardData.interval || 1;
    let repetitions = cardData.repetitions || 0;
    let ease = cardData.ease || 2.5;
    
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
    
    // Update the flashcard
    await updateDoc(cardRef, {
      lastReviewed: now.toISOString(),
      nextReview: nextReview.toISOString(),
      ease,
      interval,
      repetitions
    });
    
    // Update set's last studied time
    const setRef = doc(db, "flashcard_sets", cardData.setId);
    await updateDoc(setRef, { 
      lastStudied: now.toISOString() 
    });
    
  } catch (error) {
    console.error("Error updating flashcard review:", error);
    toast.error("Failed to save your progress");
  }
}

export async function getStudyStats(userId: string): Promise<StudyStats> {
  try {
    const q = query(
      collection(db, "study_stats"),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Return default stats if none exist
      return {
        totalCards: 0,
        masteredCards: 0,
        dueCards: 0,
        studyStreak: 0,
        totalStudySessions: 0,
      };
    }
    
    const stats = querySnapshot.docs[0].data();
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

// We don't need the auth methods anymore since Firebase Auth handles them
export async function getUser() {
  // This is a placeholder - we'll use Firebase Auth directly in components
  return null;
}
