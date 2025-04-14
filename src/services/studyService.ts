import { toast } from "sonner";
import { StudyStats } from "@/interfaces";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function updateFlashcardReview(
  cardId: string,
  quality: number
): Promise<void> {
  try {
    const cardRef = doc(db, "flashcards", cardId);
    const cardSnap = await getDoc(cardRef);
    console.log("Card snapshot:", cardSnap.data());

    if (!cardSnap.exists()) {
      throw new Error("Card not found");
    }
    const cardData = cardSnap.data();

    // Calculate new values based on SRS algorithm
    const now = new Date();
    let interval = cardData.interval || 1;
    let repetitions = cardData.repetitions || 0;
    let ease = cardData.ease || 2.5;

    if (quality >= 3) {
      repetitions++;
      if (repetitions === 1) interval = 1;
      else if (repetitions === 2) interval = 6;
      else interval = Math.round(interval * ease);
      ease = Math.max(
        1.3,
        ease + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
      );
    } else {
      repetitions = 0;
      interval = 1;
    }

    const nextReview = new Date();
    nextReview.setDate(now.getDate() + interval);

    await updateDoc(cardRef, {
      lastReviewed: now.toISOString(),
      nextReview: nextReview.toISOString(),
      ease,
      interval,
      repetitions,
    });

    const setRef = doc(db, "flashcard_sets", cardData.setId);
    await updateDoc(setRef, {
      lastStudied: now.toISOString(),
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
      return {
        totalCards: 0,
        masteredCards: 0,
        dueCards: 0,
        studyStreak: 1,
        totalStudySessions: 0,
      };
    }

    const stats = querySnapshot.docs[0].data();
    return {
      totalCards: stats.totalCards || 0,
      masteredCards: stats.masteredCards || 0,
      dueCards: stats.dueCards || 0,
      studyStreak: stats.studyStreak || 1,
      totalStudySessions: stats.totalStudySessions || 0,
    };
  } catch (error) {
    console.error("Error getting study stats:", error);
    return {
      totalCards: 0,
      masteredCards: 0,
      dueCards: 0,
      studyStreak: 1,
      totalStudySessions: 0,
    };
  }
}
