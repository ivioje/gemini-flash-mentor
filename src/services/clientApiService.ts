import { Flashcard, FlashcardSet, StudyStats } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  return user?.$id || '';
}

// Placeholder for backward compatibility
export async function getUser() {
  // This is a placeholder - we'll use Firebase Auth directly in components
  return null;
}
