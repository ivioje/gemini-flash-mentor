
import { toast } from "sonner";
import { prisma } from "@/lib/prisma";
import { Flashcard, FlashcardSet, StudyStats } from "@/types";
import { useUser } from "@clerk/clerk-react";

// Helper to update spaced repetition data
function calculateNextReview(quality: number, previousInterval: number, previousEase: number, repetitions: number): {
  nextReviewDate: Date,
  ease: number,
  interval: number,
  repetitions: number
} {
  // Implementation of SuperMemo-2 algorithm
  let ease = previousEase;
  let interval = previousInterval;
  let newRepetitions = repetitions;
  
  // Adjust ease factor based on performance (0-5 scale)
  if (quality < 3) {
    // Reset if incorrect
    newRepetitions = 0;
    interval = 1;
  } else {
    // Correct response
    newRepetitions += 1;
    
    // Adjust ease factor (min 1.3)
    ease = Math.max(1.3, ease + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // Calculate interval
    if (newRepetitions === 1) {
      interval = 1;
    } else if (newRepetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease);
    }
  }
  
  // Calculate next review date
  const now = new Date();
  const nextReviewDate = new Date();
  nextReviewDate.setDate(now.getDate() + interval);
  
  return { 
    nextReviewDate,
    ease,
    interval,
    repetitions: newRepetitions
  };
}

export async function getFlashcardSets(userId: string): Promise<FlashcardSet[]> {
  try {
    const sets = await prisma.flashcardSet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    const formattedSets = await Promise.all(sets.map(async (set) => {
      const cardCount = await prisma.flashcard.count({
        where: { setId: set.id }
      });
      
      return {
        id: set.id,
        title: set.title,
        description: set.description,
        createdAt: set.createdAt.toISOString(),
        lastStudied: set.lastStudied?.toISOString() || null,
        cardCount,
        category: set.category,
        mastery: set.mastery,
      };
    }));
    
    return formattedSets;
  } catch (error) {
    console.error("Error getting flashcard sets:", error);
    throw new Error("Failed to fetch flashcard sets");
  }
}

export async function getFlashcardSet(id: string): Promise<FlashcardSet | null> {
  try {
    const set = await prisma.flashcardSet.findUnique({
      where: { id }
    });
    
    if (!set) return null;
    
    const cardCount = await prisma.flashcard.count({
      where: { setId: id }
    });
    
    return {
      id: set.id,
      title: set.title,
      description: set.description,
      createdAt: set.createdAt.toISOString(),
      lastStudied: set.lastStudied?.toISOString() || null,
      cardCount,
      category: set.category,
      mastery: set.mastery,
    };
  } catch (error) {
    console.error("Error getting flashcard set:", error);
    throw new Error("Failed to fetch flashcard set");
  }
}

export async function getFlashcards(setId: string): Promise<Flashcard[]> {
  try {
    const cards = await prisma.flashcard.findMany({
      where: { setId }
    });
    
    return cards.map(card => ({
      id: card.id,
      setId: card.setId,
      question: card.question,
      answer: card.answer,
      lastReviewed: card.lastReviewed?.toISOString() || null,
      nextReview: card.nextReview?.toISOString() || null,
      ease: card.ease,
      interval: card.interval,
      repetitions: card.repetitions,
    }));
  } catch (error) {
    console.error("Error getting flashcards:", error);
    throw new Error("Failed to fetch flashcards");
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
    // Create the new flashcard set
    const newSet = await prisma.flashcardSet.create({
      data: {
        title,
        description,
        category,
        userId,
      }
    });
    
    // Create all flashcards in the set
    if (flashcards.length > 0) {
      await prisma.flashcard.createMany({
        data: flashcards.map(card => ({
          question: card.question,
          answer: card.answer,
          setId: newSet.id,
        }))
      });
      
      // Update the user's total cards count
      await prisma.studyStats.upsert({
        where: { userId },
        update: {
          totalCards: {
            increment: flashcards.length
          }
        },
        create: {
          userId,
          totalCards: flashcards.length
        }
      });
    }
    
    toast.success("Flashcard set created successfully!");
    
    return {
      id: newSet.id,
      title: newSet.title,
      description: newSet.description,
      createdAt: newSet.createdAt.toISOString(),
      lastStudied: null,
      cardCount: flashcards.length,
      category: newSet.category,
      mastery: 0,
    };
  } catch (error) {
    console.error("Error creating flashcard set:", error);
    toast.error("Failed to create flashcard set");
    throw new Error("Failed to create flashcard set");
  }
}

export async function updateFlashcardReview(
  cardId: string,
  quality: number // 0-5 rating of how well the user recalled the answer
): Promise<void> {
  try {
    // Get the current card
    const card = await prisma.flashcard.findUnique({
      where: { id: cardId },
      include: { set: true }
    });
    
    if (!card) {
      throw new Error("Card not found");
    }
    
    // Calculate next review details using spaced repetition algorithm
    const { nextReviewDate, ease, interval, repetitions } = calculateNextReview(
      quality, 
      card.interval, 
      card.ease, 
      card.repetitions
    );
    
    // Update the flashcard
    await prisma.flashcard.update({
      where: { id: cardId },
      data: {
        lastReviewed: new Date(),
        nextReview: nextReviewDate,
        ease,
        interval,
        repetitions,
      }
    });
    
    // Update the set's lastStudied date
    await prisma.flashcardSet.update({
      where: { id: card.setId },
      data: { lastStudied: new Date() }
    });
    
    // Update mastery for the set
    await updateSetMastery(card.setId);
    
    // Update user study streak
    await updateStudyStreak(card.set.userId);
    
    if (quality >= 3) {
      toast("Good job! You're making progress.");
    } else {
      toast("Keep practicing! You'll get it next time.");
    }
  } catch (error) {
    console.error("Error updating flashcard review:", error);
    toast.error("Failed to save your progress");
  }
}

async function updateSetMastery(setId: string): Promise<void> {
  try {
    const allCards = await prisma.flashcard.findMany({
      where: { setId }
    });
    
    if (allCards.length === 0) return;
    
    // Consider a card mastered if it has repetitions >= 3 and last review was successful
    const masteredCards = allCards.filter(card => card.repetitions >= 3);
    const masteryPercentage = Math.round((masteredCards.length / allCards.length) * 100);
    
    await prisma.flashcardSet.update({
      where: { id: setId },
      data: { mastery: masteryPercentage }
    });
    
    // Also update user's total mastered cards
    const set = await prisma.flashcardSet.findUnique({
      where: { id: setId },
      select: { userId: true }
    });
    
    if (set) {
      await updateUserMasteredCards(set.userId);
    }
  } catch (error) {
    console.error("Error updating set mastery:", error);
  }
}

async function updateUserMasteredCards(userId: string): Promise<void> {
  try {
    // Count all cards by this user
    const totalCards = await prisma.flashcard.count({
      where: {
        set: { userId }
      }
    });
    
    // Count mastered cards
    const masteredCards = await prisma.flashcard.count({
      where: {
        set: { userId },
        repetitions: { gte: 3 }
      }
    });
    
    // Count due cards (those with nextReview date today or earlier)
    const dueCards = await prisma.flashcard.count({
      where: {
        set: { userId },
        nextReview: { lte: new Date() }
      }
    });
    
    // Update study stats
    await prisma.studyStats.upsert({
      where: { userId },
      update: {
        totalCards,
        masteredCards,
        dueCards
      },
      create: {
        userId,
        totalCards,
        masteredCards,
        dueCards
      }
    });
  } catch (error) {
    console.error("Error updating user mastered cards:", error);
  }
}

async function updateStudyStreak(userId: string): Promise<void> {
  try {
    // Get the user's current stats
    const stats = await prisma.studyStats.findUnique({
      where: { userId }
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // If no stats exist yet, create with streak of 1
    if (!stats) {
      await prisma.studyStats.create({
        data: {
          userId,
          studyStreak: 1,
          lastStudyDate: new Date(),
          totalStudySessions: 1
        }
      });
      return;
    }
    
    const lastStudy = stats.lastStudyDate ? new Date(stats.lastStudyDate) : null;
    if (lastStudy) {
      lastStudy.setHours(0, 0, 0, 0);
    }
    
    let streak = stats.studyStreak;
    
    // If they already studied today, don't increment the streak or sessions
    if (lastStudy && lastStudy.getTime() === today.getTime()) {
      // Already studied today, do nothing
      return;
    } 
    // If they studied yesterday, increment the streak
    else if (lastStudy && lastStudy.getTime() === yesterday.getTime()) {
      streak += 1;
    } 
    // If they didn't study yesterday, reset the streak to 1
    else {
      streak = 1;
    }
    
    // Update the study stats
    await prisma.studyStats.update({
      where: { userId },
      data: {
        studyStreak: streak,
        lastStudyDate: new Date(),
        totalStudySessions: { increment: 1 }
      }
    });
  } catch (error) {
    console.error("Error updating study streak:", error);
  }
}

export async function getStudyStats(userId: string): Promise<StudyStats> {
  try {
    // Get user stats or create if they don't exist
    let stats = await prisma.studyStats.findUnique({
      where: { userId }
    });
    
    if (!stats) {
      stats = await prisma.studyStats.create({
        data: { userId }
      });
    }
    
    // Update due cards count which could change daily
    const dueCards = await prisma.flashcard.count({
      where: {
        set: { userId },
        nextReview: { lte: new Date() }
      }
    });
    
    if (dueCards !== stats.dueCards) {
      await prisma.studyStats.update({
        where: { userId },
        data: { dueCards }
      });
      stats.dueCards = dueCards;
    }
    
    return {
      totalCards: stats.totalCards,
      masteredCards: stats.masteredCards,
      dueCards: stats.dueCards,
      studyStreak: stats.studyStreak,
      totalStudySessions: stats.totalStudySessions,
    };
  } catch (error) {
    console.error("Error getting study stats:", error);
    return {
      totalCards: 0,
      masteredCards: 0,
      dueCards: 0,
      studyStreak: 0,
      totalStudySessions: 0,
    };
  }
}
