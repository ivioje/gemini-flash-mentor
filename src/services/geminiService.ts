const GEMINI_API_KEY = "AIzaSyCOA-8RkNK0twwMZYDlkAuHzfw7CJFTWiU";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function generateFlashcards(topic: string, numberOfCards: number = 5): Promise<{question: string, answer: string}[]> {
  try {
    const prompt = `Generate ${numberOfCards} flashcards about "${topic}". 
    Return the response as an array of JSON objects, each with a "question" and "answer" field. 
    Make the questions concise but specific. 
    Make the answers detailed enough to be educational but not excessively long. 
    Ensure each flashcard contains educational value for a student.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the response text which is expected to be JSON
    const responseText = data.candidates[0].content.parts[0].text;
    let parsedResponse: {question: string, answer: string}[];
    
    try {
      // If the AI returns a JSON string with code formatting (```json...```)
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        parsedResponse = JSON.parse(jsonMatch[1]);
      } else {
        // Otherwise try to parse the whole response
        parsedResponse = JSON.parse(responseText);
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      throw new Error("Failed to parse AI response");
    }
    
    return parsedResponse;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

export async function generateQuizFromFlashcards(flashcards: {question: string, answer: string}[]): Promise<{question: string, options: string[], correctAnswer: string}[]> {
  try {
    const prompt = `Convert these flashcards into multiple-choice quiz questions:
    ${JSON.stringify(flashcards)}
    
    For each flashcard, generate a question with 4 possible answers, with one being the correct answer.
    Return the quiz as an array of JSON objects, each with "question", "options" (array of 4 strings), and "correctAnswer" (string matching one of the options) fields.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    const responseText = data.candidates[0].content.parts[0].text;
    let parsedResponse;
    
    try {
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        parsedResponse = JSON.parse(jsonMatch[1]);
      } else {
        parsedResponse = JSON.parse(responseText);
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      throw new Error("Failed to parse AI response");
    }
    
    return parsedResponse;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
}
