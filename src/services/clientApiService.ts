
import { Flashcard, FlashcardSet, StudyStats } from "@/types";
import { toast } from "sonner";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

// Get the current user ID from our Auth Context
export function useUserId() {
  const { user } = useAuth();
  return user?.$id || '';
}

// Helper function to convert Firestore data to our app's data model
const convertFlashcardSet = (doc: any): FlashcardSet => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    category: data.category,
    created_at: data.created_at?.toDate() || new Date(),
    updated_at: data.updated_at?.toDate() || new Date(),
    user_id: data.user_id,
    public: data.public || false,
    tags: data.tags || [],
    cardCount: data.cardCount || 0,
    lastStudied: data.lastStudied || null,
    mastery: data.mastery || 0
  };
};

export async function getFlashcardSets(userId: string): Promise<FlashcardSet[]> {
  try {
    const q = query(
      collection(db, "flashcard_sets"),
      where("user_id", "==", userId),
      orderBy("created_at", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const sets = querySnapshot.docs.map(convertFlashcardSet);
    return sets;
  } catch (error) {
    console.error("Error getting flashcard sets:", error);
    toast.error("Failed to fetch flashcard sets");
    return [];
  }
}

export async function getFlashcardSet(id: string): Promise<FlashcardSet | null> {
  try {
    const docRef = doc(db, "flashcard_sets", id);
    const docSnapshot = await getDoc(docRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const setData = docSnapshot.data();
    const cardsQuery = query(
      collection(db, "flashcards"),
      where("setId", "==", id)
    );
    
    const cardsSnapshot = await getDocs(cardsQuery);
    
    return {
      id: docSnapshot.id,
      title: setData.title,
      description: setData.description,
      category: setData.category,
      created_at: setData.created_at?.toDate() || new Date(),
      updated_at: setData.updated_at?.toDate() || new Date(),
      user_id: setData.user_id,
      cardCount: cardsSnapshot.size,
      lastStudied: setData.lastStudied || null,
      mastery: setData.mastery || 0
    };
  } catch (error) {
    console.error("Error getting flashcard set:", error);
    toast.error("Failed to fetch flashcard set");
    return null;
  }
}

export async function getFlashcards(setId: string): Promise<Flashcard[]> {
  try {
    const q = query(
      collection(db, "flashcards"),
      where("setId", "==", setId)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        setId: data.setId,
        question: data.question,
        answer: data.answer,
        lastReviewed: data.lastReviewed || null,
        nextReview: data.nextReview || null,
        ease: data.ease || 2.5,
        interval: data.interval || 1,
        repetitions: data.repetitions || 0,
      };
    });
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
    // Create the new flashcard set
    const newSetRef = collection(db, "flashcard_sets");
    const newSet = await addDoc(newSetRef, {
      title,
      description,
      category,
      user_id: userId,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      mastery: 0
    });
    
    // Create all flashcards in the set
    if (flashcards.length > 0) {
      const createFlashcardsPromises = flashcards.map(card => 
        addDoc(collection(db, "flashcards"), {
          question: card.question,
          answer: card.answer,
          setId: newSet.id,
          ease: 2.5,
          interval: 1,
          repetitions: 0
        })
      );
      
      await Promise.all(createFlashcardsPromises);
    }
    
    toast.success("Flashcard set created successfully!");
    
    return {
      id: newSet.id,
      title,
      description,
      category,
      created_at: new Date(),
      updated_at: new Date(),
      user_id: userId,
      cardCount: flashcards.length,
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
