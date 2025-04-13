
import { Flashcard, FlashcardSet, StudyStats } from "@/types";
import { useUserStore } from "@/stores/userStore";

// Re-export functions from flashcard service
export { 
  getFlashcardSets, 
  getFlashcardSet, 
  getFlashcards, 
  createFlashcardSet 
} from "./flashcardService";

// Re-export functions from study service
export {
  updateFlashcardReview,
  getStudyStats
} from "./studyService";

// Helper hook to get the current user ID
export function useUserId() {
  const { user } = useUserStore();
  return user?.$id || '';
}

// Placeholder for backward compatibility
export async function getUser() {
  // Using Zustand store instead of direct Firebase calls
  return null;
}
