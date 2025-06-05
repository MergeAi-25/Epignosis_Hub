
export const ROUTES = {
  HOME: '/',
  BLOG: '/blog', // Route can exist, but might not be in main nav
  QUIZZES: '/quizzes',
  STUDY_TOPICS: '/study-topics',
  CHATBOT: '/chatbot', // Renamed to 'Bible Chat' in UI
  PROFILE: '/profile',
};

export const GEMINI_CHAT_MODEL = 'gemini-2.5-flash-preview-04-17';
// fix: Removed GEMINI_API_KEY_PROMPT_MESSAGE as UI for API key is prohibited
// export const GEMINI_API_KEY_PROMPT_MESSAGE = "Please enter your Gemini API Key to use the AI Chatbot. Your key is stored locally in your browser and not shared.";

export const LOCAL_STORAGE_USER_KEY = 'epignosisHubUser';
export const LOCAL_STORAGE_USER_DATA_KEY = 'epignosisHubUserData';
// fix: Removed LOCAL_STORAGE_API_KEY as UI for API key is prohibited
// export const LOCAL_STORAGE_API_KEY = 'epignosisHubApiKey';

export const APP_NAME = "Epignosis Hub";
export const APP_TAGLINE = "Epignosis Hub helps you deepen your understanding of Scripture through interactive Bible study, quizzes, and AI-assisted learning.";
