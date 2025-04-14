import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { FlashcardSet, Flashcard } from "@/interfaces";

const convertFlashcardSet = (
  doc: QueryDocumentSnapshot<DocumentData>
): FlashcardSet => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    category: data.category,
    cards: data.cards || [],
    created_at: data.created_at?.toDate() || new Date(),
    updated_at: data.updated_at?.toDate() || new Date(),
    user_id: data.user_id,
    public: data.public || false,
    tags: data.tags || [],
  };
};

export const getFlashcardSets = async (
  userId: string
): Promise<FlashcardSet[]> => {
  try {
    const q = query(
      collection(db, "flashcard_sets"),
      where("user_id", "==", userId),
      orderBy("created_at", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFlashcardSet);
  } catch (error) {
    console.error("Error getting flashcard sets:", error);
    throw error;
  }
};

export const getPublicFlashcardSets = async (): Promise<FlashcardSet[]> => {
  try {
    const q = query(
      collection(db, "flashcard_sets"),
      where("public", "==", true),
      orderBy("created_at", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFlashcardSet);
  } catch (error) {
    console.error("Error getting public flashcard sets:", error);
    throw error;
  }
};

export const getFlashcardSetById = async (
  id: string
): Promise<FlashcardSet> => {
  try {
    const docSnap = await getDoc(doc(db, "flashcard_sets", id));

    if (!docSnap.exists()) {
      throw new Error("Flashcard set not found");
    }

    return convertFlashcardSet(docSnap as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error("Error getting flashcard set:", error);
    throw error;
  }
};

export const createFlashcardSet = async (
  flashcardSet: Omit<FlashcardSet, "id" | "created_at" | "updated_at">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "flashcard_sets"), {
      ...flashcardSet,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating flashcard set:", error);
    throw error;
  }
};

export const updateFlashcardSet = async (
  id: string,
  data: Partial<Omit<FlashcardSet, "id" | "created_at" | "updated_at">>
): Promise<void> => {
  try {
    await updateDoc(doc(db, "flashcard_sets", id), {
      ...data,
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating flashcard set:", error);
    throw error;
  }
};

export const deleteFlashcardSet = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "flashcard_sets", id));
  } catch (error) {
    console.error("Error deleting flashcard set:", error);
    throw error;
  }
};

export const saveStudySession = async (studyData): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "study_sessions"), {
      ...studyData,
      timestamp: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error saving study session:", error);
    throw error;
  }
};

export const getUserStudyStats = async (userId: string) => {
  try {
    const q = query(
      collection(db, "study_sessions"),
      where("user_id", "==", userId),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error("Error getting user study stats:", error);
    throw error;
  }
};
