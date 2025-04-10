
import { Client, Databases, ID, Query, Storage } from 'appwrite';

// Appwrite configuration
const endpoint = 'https://cloud.appwrite.io/v1';
const projectId = '67f6569f00368918227f'; // Using the provided project ID

// Initialize the Appwrite client
const client = new Client();
client.setEndpoint(endpoint).setProject(projectId);

// Initialize Appwrite services (only databases and storage, not account)
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and collection constants
export const DATABASES = {
  DEFAULT: 'gemmentor',
};

export const COLLECTIONS = {
  FLASHCARD_SETS: 'flashcard_sets',
  FLASHCARDS: 'flashcards',
  STUDY_STATS: 'study_stats',
};

// Helper function to generate unique IDs
export const generateId = () => ID.unique();
