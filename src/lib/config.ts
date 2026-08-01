export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const TOKEN_COOKIE = "gearup_token";

export const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;
