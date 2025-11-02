import path from "path";
import dotenv from "dotenv";
import { cleanEnv, str, port } from "envalid";

// Determine environment file path
const nodeEnv = process.env.NODE_ENV || null;
const envFile = nodeEnv ? `.env.${nodeEnv}`: '.env';

// Try to load a specific env file if it exists, fallback to .env
const envPath = path.resolve(process.cwd(), envFile);

console.log(`🧩 Loading environment from: ${envPath}`);

dotenv.config({ path: envPath });

// Validate and export
export const ENV = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "production", "test"] }),
  PORT: port({ default: 5000 }),
  MONGO_URI: str(),
  API_VERSION: str({ default: "v1" }),
});
