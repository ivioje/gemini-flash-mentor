
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MainLayout } from "@/layouts/MainLayout";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { createFlashcardSet } from "@/services/apiService";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Loader2, Plus, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { askGemini } from "@/services/geminiService";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  category: z.string().min(1, "Please select a category"),
});

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export default function CreateSet() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { id: Date.now().toString(), question: "", answer: "" },
  ]);
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be signed in to create a flashcard set");
      return;
    }
    
    // Validate flashcards
    const validFlashcards = flashcards.filter(
      (card) => card.question.trim() !== "" && card.answer.trim() !== ""
    );
    
    if (validFlashcards.length === 0) {
      toast.error("Please add at least one flashcard with both question and answer");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const flashcardData = validFlashcards.map((card) => ({
        question: card.question,
        answer: card.answer,
      }));
      
      const newSet = await createFlashcardSet(
        user.id,
        values.title,
        values.description,
        values.category,
        flashcardData
      );
      
      navigate(`/sets/${newSet.id}`);
    } catch (error) {
      console.error("Error creating set:", error);
      toast.error("Failed to create flashcard set");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const addFlashcard = () => {
    setFlashcards([
      ...flashcards,
      { id: Date.now().toString(), question: "", answer: "" },
    ]);
  };
  
  const removeFlashcard = (id: string) => {
    if (flashcards.length > 1) {
      setFlashcards(flashcards.filter((card) => card.id !== id));
    } else {
      toast("You need at least one flashcard", {
        description: "Clear the fields instead if you want to start over",
      });
    }
  };
  
  const updateFlashcard = (id: string, field: "question" | "answer", value: string) => {
    setFlashcards(
      flashcards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };
  
  const generateFlashcards = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for AI generation");
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Use the title as the set title if not already set
      if (!form.getValues().title) {
        form.setValue("title", topic);
      }
      
      // Generate AI flashcards
      const aiFlashcards = await askGemini(topic);
      
      if (aiFlashcards && aiFlashcards.length > 0) {
        // Replace existing empty flashcards or add to existing ones
        const existingNonEmptyCards = flashcards.filter(
          card => card.question.trim() !== "" || card.answer.trim() !== ""
        );
        
        const newFlashcards = [
          ...existingNonEmptyCards,
          ...aiFlashcards.map(card => ({
            id: Date.now() + Math.random().toString(),
            question: card.question,
            answer: card.answer,
          })),
        ];
        
        setFlashcards(newFlashcards);
        toast.success(`Generated ${aiFlashcards.length} flashcards`);
      } else {
        toast.error("Failed to generate flashcards");
      }
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast.error("Failed to generate flashcards");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const categories = [
    "Science",
    "Mathematics",
    "History",
    "Literature",
    "Languages",
    "Computer Science",
    "Art",
    "Music",
    "Geography",
    "Other",
  ];

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Flashcard Set</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Biology 101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description about this flashcard set"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Flashcards</h2>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 bg-muted rounded-lg p-2">
                    <Input
                      placeholder="Enter topic for AI generation"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="max-w-[180px] sm:max-w-xs"
                    />
                    <Button
                      type="button"
                      onClick={generateFlashcards}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate AI Cards"
                      )}
                    </Button>
                  </div>
                  <Button type="button" variant="outline" onClick={addFlashcard}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Card
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {flashcards.map((flashcard, index) => (
                  <Card key={flashcard.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Card {index + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFlashcard(flashcard.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <FormLabel htmlFor={`question-${flashcard.id}`}>
                            Question
                          </FormLabel>
                          <Textarea
                            id={`question-${flashcard.id}`}
                            value={flashcard.question}
                            onChange={(e) =>
                              updateFlashcard(flashcard.id, "question", e.target.value)
                            }
                            placeholder="Enter question"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <FormLabel htmlFor={`answer-${flashcard.id}`}>
                            Answer
                          </FormLabel>
                          <Textarea
                            id={`answer-${flashcard.id}`}
                            value={flashcard.answer}
                            onChange={(e) =>
                              updateFlashcard(flashcard.id, "answer", e.target.value)
                            }
                            placeholder="Enter answer"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Flashcard Set"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}
