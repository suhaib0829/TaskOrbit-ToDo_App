// Data Models based on BRD 2.2 and 3.2.1

export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export type Priority = 'low' | 'medium' | 'high';
export type Category = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Education' | 'Other';

export interface Item {
  id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt?: string;
  status?: 'active' | 'completed' | 'archived';
  priority?: Priority;
  category?: Category;
}

// Navigation Types
export type ScreenName = 'Login' | 'Register' | 'Home' | 'AddItem' | 'EditItem' | 'ForgotPassword' | 'Settings';

export type NavigationParams = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  AddItem: undefined;
  EditItem: { item: Item };
  ForgotPassword: undefined;
  Settings: undefined;
};

// Theme Types
export type ThemeMode = 'light' | 'dark';
export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;
}
