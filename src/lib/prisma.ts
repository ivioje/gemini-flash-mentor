
import { PrismaClient } from '@prisma/client';

// This is a workaround for Prisma Client in browser environments
// Since we can't directly access the database from the browser,
// we'll create a mock client or use API endpoints instead

class PrismaMock {
  constructor() {
    console.log('Creating Prisma mock for browser environment');
  }

  // Add mock methods here that will be used in the browser
  async $connect() {
    console.log('Mock: Connected to database');
    return Promise.resolve();
  }

  async $disconnect() {
    console.log('Mock: Disconnected from database');
    return Promise.resolve();
  }
}

// Create a prisma instance based on the environment
const isBrowser = typeof window !== 'undefined';

// Export the appropriate client based on environment
export const prisma = isBrowser 
  ? new PrismaMock() as unknown as PrismaClient 
  : new PrismaClient();

// For development purposes
if (process.env.NODE_ENV !== 'production' && !isBrowser) {
  // @ts-ignore - Global declaration
  if (!global.prisma) {
    // @ts-ignore - Global assignment
    global.prisma = prisma;
  }
}
