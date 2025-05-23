const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;

interface FlashcardGenerated {
  question: string;
  answer: string;
}

export async function generateFlashcards(
  topic: string,
  count: number = 5
): Promise<FlashcardGenerated[]> {
  try {
    const prompt = `Create ${count} flashcards about '${topic}'. Each flashcard should have a question and an answer. The questions should be concise and the answers should be comprehensive but not too long. Format the response as a JSON array with objects containing 'question' and 'answer' properties.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error("Failed to generate flashcards");
    }

    // Parse the text response from Gemini to extract flashcards
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error("Invalid response from Gemini API");
    }

    // Extract JSON array from the text response
    const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from response");
    }

    const flashcards = JSON.parse(jsonMatch[0]);
    return flashcards.slice(0, count);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("Failed to generate flashcards");
  }
}

export async function askGemini(topic: string): Promise<FlashcardGenerated[]> {
  return generateFlashcards(topic, 5);
}
