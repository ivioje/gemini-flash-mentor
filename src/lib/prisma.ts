
// This file is kept for backward compatibility
// and will use Appwrite instead of Prisma

import { databases, COLLECTIONS, DATABASES } from './appwrite';

// Export a compatibility layer to minimize changes elsewhere
export const prisma = {
  // Mock functions that will be handled by Appwrite in apiService.ts
  async $connect() {
    console.log('Appwrite connection initialized');
    return Promise.resolve();
  },
  
  async $disconnect() {
    console.log('Appwrite connection closed');
    return Promise.resolve();
  }
};

// For compatibility with existing code
if (process.env.NODE_ENV !== 'production') {
  // @ts-ignore - Global declaration
  if (!global.prisma) {
    // @ts-ignore - Global assignment
    global.prisma = prisma;
  }
}
