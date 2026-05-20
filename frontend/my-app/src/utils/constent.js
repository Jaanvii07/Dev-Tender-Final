// If VITE_BASE_URL or VITE_API_URL is not set, fallback to your deployed backend URL.
// When testing locally, it uses localhost. 
export const BASE_URL = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_URL || (location.hostname === "localhost" ? "http://localhost:3000" : "/api");
