
import { Account, Client, Databases, ID, Query, Storage } from 'appwrite';

// Appwrite configuration
const endpoint = 'https://cloud.appwrite.io/v1';
const projectId = 'gemmentor'; // Replace with your Appwrite project ID

// Initialize the Appwrite client
const client = new Client();
client.setEndpoint(endpoint).setProject(projectId);

// Initialize Appwrite services
export const account = new Account(client);
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

// Authentication helpers
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
};

export const createAccount = async (email: string, password: string, name: string) => {
  try {
    await account.create(ID.unique(), email, password, name);
    await login(email, password);
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    return await account.createEmailSession(email, password);
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    return await account.deleteSession('current');
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};
