import { createEnv } from "@t3-oss/env-nextjs";
import { ZodError, z } from "zod";

// Define and validate the environment variables
export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]), // Ensure NODE_ENV is either 'development' or 'production'
  },
  client: {
    NEXT_PUBLIC_LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error"]),
    NEXT_PUBLIC_LOCALE_DEBUG: z.boolean().optional(),
    NEXT_PUBLIC_302_WEBSITE_URL_GLOBAL: z.string().min(1),
    NEXT_PUBLIC_302_WEBSITE_URL_CHINA: z.string().min(1),
    NEXT_PUBLIC_302_API_KEY: z.string().optional(),
    NEXT_PUBLIC_API_URL: z.string().min(1),
    NEXT_PUBLIC_FILE_API_URL: z.string().min(1),
    NEXT_PUBLIC_AUTH_API_URL: z.string().min(1),
    NEXT_PUBLIC_AUTH_PATH: z.string().min(1),
    NEXT_PUBLIC_IS_CHINA: z.boolean(),
    NEXT_PUBLIC_DEFAULT_LOCALE: z.string().min(1),
    NEXT_PUBLIC_DEFAULT_MODEL_NAME: z.string().min(1),
    NEXT_PUBLIC_DEV_HOST_NAME: z.string().optional(),
    NEXT_PUBLIC_SHOW_BRAND: z.boolean(),
    NEXT_PUBLIC_DIALOGUE_API_URL: z.string().min(1),
    NEXT_PUBLIC_GITHUB_REPO_URL: z.string().optional(),
  },
  // Runtime environment configuration
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
    NEXT_PUBLIC_LOCALE_DEBUG: process.env.NEXT_PUBLIC_LOCALE_DEBUG === "true",
    NEXT_PUBLIC_302_WEBSITE_URL_GLOBAL:
      process.env.NEXT_PUBLIC_302_WEBSITE_URL_GLOBAL,
    NEXT_PUBLIC_302_WEBSITE_URL_CHINA:
      process.env.NEXT_PUBLIC_302_WEBSITE_URL_CHINA,
    NEXT_PUBLIC_302_API_KEY: process.env.NEXT_PUBLIC_302_API_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_FILE_API_URL: process.env.NEXT_PUBLIC_FILE_API_URL,
    NEXT_PUBLIC_AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_API_URL,
    NEXT_PUBLIC_AUTH_PATH: process.env.NEXT_PUBLIC_AUTH_PATH,
    NEXT_PUBLIC_IS_CHINA: process.env.NEXT_PUBLIC_IS_CHINA === "true",
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
    NEXT_PUBLIC_DEFAULT_MODEL_NAME: process.env.NEXT_PUBLIC_DEFAULT_MODEL_NAME,
    NEXT_PUBLIC_DEV_HOST_NAME: process.env.NEXT_PUBLIC_DEV_HOST_NAME,
    NEXT_PUBLIC_SHOW_BRAND: process.env.NEXT_PUBLIC_SHOW_BRAND === "true",
    NEXT_PUBLIC_DIALOGUE_API_URL: process.env.NEXT_PUBLIC_DIALOGUE_API_URL,
    NEXT_PUBLIC_GITHUB_REPO_URL: process.env.NEXT_PUBLIC_GITHUB_REPO_URL,
  },
  // Handle validation errors
  onValidationError: (error: ZodError) => {
    console.error(
      "❌ Invalid environment variables:",
      error.flatten().fieldErrors
    );
    process.exit(1);
  },
  emptyStringAsUndefined: true, // Treat empty strings as undefined
});
