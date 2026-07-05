// Import the 'config' function from the 'dotenv' package
import { config } from "dotenv";

// Load environment variables from a .env file into process.env
config({ path: ".env" });

/**
 * Destructure and export the required environment variables from process.env.
 * 
 * 📌 To access any environment variable throughout the project,
 *     you MUST add it here first.
 * 
 * Example:
 * - To use process.env.API_KEY in your app,
 *   add it below like: export const { API_KEY } = process.env;
 */
export const {
  PORT,        // Port number your server will listen on
  MONGO_URI,      // MongoDB connection string
  JWT_SECRET,  // Secret key used for signing JWT tokens
} = process.env;
