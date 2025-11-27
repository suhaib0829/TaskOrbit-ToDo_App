// ---------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------

// TOGGLE THESE TO FALSE TO USE REAL FIREBASE/API
export const USE_MOCK_AUTH = true; 
export const USE_MOCK_API = true;

// MockAPI.io Configuration (Replace with your actual endpoint)
export const MOCKAPI_BASE_URL = 'https://65abc123def456.mockapi.io/api/v1'; 
export const RESOURCE_NAME = 'items'; // e.g., tasks, notes, products

// Firebase Configuration (Replace with your actual config from Console)
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
