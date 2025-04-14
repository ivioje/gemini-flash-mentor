import { Flashcard, FlashcardSet } from "@/interfaces";
import { toast } from "sonner";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const convertFlashcardSet = (
  doc: QueryDocumentSnapshot<DocumentData>
): FlashcardSet => {
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
    mastery: data.mastery || 0,
  };
};

export async function getFlashcardSets(
  userId: string
): Promise<FlashcardSet[]> {
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

export async function getFlashcardSet(
  id: string
): Promise<FlashcardSet | null> {
  try {
    const docRef = doc(db, "flashcard_sets", id);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      return null;
    }

    return convertFlashcardSet(
      docSnapshot as QueryDocumentSnapshot<DocumentData>
    );
  } catch (error) {
    console.error("Error getting flashcard set:", error);
    toast.error("Failed to fetch flashcard set");
    return null;
  }
}

export async function getFlashcards(setId: string): Promise<Flashcard[]> {
  try {
    const q = query(collection(db, "flashcards"), where("setId", "==", setId));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
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
    const newSetRef = collection(db, "flashcard_sets");
    const newSet = await addDoc(newSetRef, {
      title,
      description,
      category,
      user_id: userId,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      public: false,
      tags: [],
      cardCount: flashcards.length,
      mastery: 0,
      lastStudied: null,
    });

    if (flashcards.length > 0) {
      const createFlashcardsPromises = flashcards.map((card) =>
        addDoc(collection(db, "flashcards"), {
          question: card.question,
          answer: card.answer,
          setId: newSet.id,
          ease: 2.5,
          interval: 1,
          repetitions: 0,
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
      public: false,
      tags: [],
      cardCount: flashcards.length,
      lastStudied: null,
      mastery: 0,
    };
  } catch (error) {
    console.error("Error creating flashcard set:", error);
    toast.error("Failed to create flashcard set");
    throw new Error("Failed to create flashcard set");
  }
}
