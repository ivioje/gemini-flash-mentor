
import { MainLayout } from "@/layouts/MainLayout";
import { CreateFlashcardSetForm } from "@/components/CreateFlashcardSetForm";

export default function CreateSet() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Flashcard Set</h1>
        <CreateFlashcardSetForm />
      </div>
    </MainLayout>
  );
}
