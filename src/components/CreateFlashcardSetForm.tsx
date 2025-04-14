import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { generateFlashcards } from "@/services/geminiService";

import { toast } from "sonner";
import { Loader2, Plus, Trash, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "Science",
  "Mathematics",
  "History",
  "Literature",
  "Computer Science",
  "Languages",
  "Arts",
  "Business",
  "Other",
];

interface CreateFlashcardSetFormProps {
  onSubmit: (data) => Promise<void>;
  isSubmitting: boolean;
}

export function CreateFlashcardSetForm({
  onSubmit,
  isSubmitting,
}: CreateFlashcardSetFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [aiTopic, setAiTopic] = useState("");
  const [aiCardsCount, setAiCardsCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<
    { id: string; question: string; answer: string }[]
  >([{ id: "1", question: "", answer: "" }]);
  const [activeTab, setActiveTab] = useState("manual");

  const addCard = () => {
    setFlashcards([
      ...flashcards,
      { id: Date.now().toString(), question: "", answer: "" },
    ]);
  };

  const removeCard = (id: string) => {
    if (flashcards.length === 1) {
      toast.error("You need at least one flashcard");
      return;
    }
    setFlashcards(flashcards.filter((card) => card.id !== id));
  };

  const updateCard = (
    id: string,
    field: "question" | "answer",
    value: string
  ) => {
    setFlashcards(
      flashcards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  const generateCardsWithAI = async () => {
    if (!aiTopic) {
      toast.error("Please enter a topic for generation");
      return;
    }

    try {
      setIsGenerating(true);
      const generatedCards = await generateFlashcards(aiTopic, aiCardsCount);

      // Add IDs to the generated cards and update flashcards state
      const cardsWithIds = generatedCards.map((card) => ({
        ...card,
        id: Date.now() + Math.random().toString(),
      }));

      setFlashcards(cardsWithIds);

      // Also update the title and description if they're empty
      if (!title) {
        setTitle(`${aiTopic} Flashcards`);
      }
      if (!description) {
        setDescription(`A set of flashcards about ${aiTopic}`);
      }

      toast.success("Flashcards generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error generating flashcards. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be signed in to create flashcards");
      return;
    }

    // Validation
    if (!title) {
      toast.error("Title is required");
      return;
    }

    if (!category) {
      toast.error("Category is required");
      return;
    }

    const hasEmptyCards = flashcards.some(
      (card) => !card.question || !card.answer
    );
    if (hasEmptyCards) {
      toast.error("All flashcards must have both a question and answer");
      return;
    }

    try {
      // Map to remove IDs since the API doesn't need them
      const cardsData = flashcards.map(({ question, answer }) => ({
        question,
        answer,
      }));

      await onSubmit({
        title,
        description,
        category,
        cards: cardsData,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error creating flashcard set");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 mb-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your flashcard set"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this flashcard set is about"
              className="h-24"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Flashcards</h3>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="manual">Create Manually</TabsTrigger>
              <TabsTrigger value="ai">Generate with AI</TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <div className="space-y-4">
                {flashcards.map((card, index) => (
                  <Card key={card.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Card {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCard(card.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`question-${card.id}`}>
                            Question
                          </Label>
                          <Input
                            id={`question-${card.id}`}
                            value={card.question}
                            onChange={(e) =>
                              updateCard(card.id, "question", e.target.value)
                            }
                            placeholder="Enter your question"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`answer-${card.id}`}>Answer</Label>
                          <Textarea
                            id={`answer-${card.id}`}
                            value={card.answer}
                            onChange={(e) =>
                              updateCard(card.id, "answer", e.target.value)
                            }
                            placeholder="Enter the answer"
                            className="h-20"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addCard}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Card
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ai">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="aiTopic">Topic</Label>
                      <Input
                        id="aiTopic"
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        placeholder="Enter a topic for AI to generate flashcards"
                      />
                    </div>

                    <div>
                      <Label htmlFor="aiCardsCount">Number of cards</Label>
                      <Input
                        id="aiCardsCount"
                        type="number"
                        min={1}
                        max={20}
                        value={aiCardsCount}
                        onChange={(e) =>
                          setAiCardsCount(parseInt(e.target.value))
                        }
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={generateCardsWithAI}
                      className="w-full"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate Flashcards
                        </>
                      )}
                    </Button>

                    {flashcards.length > 0 && activeTab === "ai" && (
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">
                          Generated Flashcards:
                        </h5>
                        <p className="text-sm text-muted-foreground mb-2">
                          {flashcards.length} flashcards generated. Switch to
                          "Create Manually" tab to edit them.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setActiveTab("manual")}
                          className="w-full"
                        >
                          Edit Flashcards
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Create Flashcard Set
        </Button>
      </div>
    </form>
  );
}
