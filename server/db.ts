import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Please add your database URL to environment variables.",
  );
}

console.log('DATABASE_URL configured:', process.env.DATABASE_URL ? 'Yes' : 'No');

// Configure postgres connection
const client = postgres(process.env.DATABASE_URL, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  max: 1, // Limit connections for serverless
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

// Test connection
client`SELECT 1`.then(() => {
  console.log('✅ Database connected successfully');
}).catch((error) => {
  console.error('❌ Database connection failed:', error);
});
