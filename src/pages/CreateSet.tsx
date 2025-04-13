
// Remove any potential Clerk import that might exist in this file
// and ensure we're only using Firebase auth

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateFlashcardSetForm } from "@/components/CreateFlashcardSetForm";
import { MainLayout } from "@/layouts/MainLayout";
import { toast } from "sonner";
import { createFlashcardSet } from "@/services/clientApiService";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateSet() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!user) {
      toast.error("You need to be logged in to create a flashcard set");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare the flashcards array
      const flashcards = data.cards.map((card: any) => ({
        question: card.question,
        answer: card.answer
      }));
      
      // Create the flashcard set
      const newSet = await createFlashcardSet(
        user.$id,
        data.title,
        data.description,
        data.category,
        flashcards
      );
      
      navigate(`/sets/${newSet.id}`);
    } catch (error) {
      console.error("Error creating flashcard set:", error);
      toast.error("Failed to create flashcard set");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Flashcard Set</h1>
        <CreateFlashcardSetForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </MainLayout>
  );
}
