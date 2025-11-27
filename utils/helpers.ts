import { Priority } from "../types";

export const getUsernameFromEmail = (email: string | null | undefined): string => {
  if (!email) return 'Guest';
  // Remove everything after @ and capitalize first letter
  const name = email.split('@')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const getPriorityColor = (priority?: Priority) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
    case 'medium': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
    case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    default: return 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400';
  }
};

export const getAvatarInitials = (name: string) => {
  return name.substring(0, 2).toUpperCase();
};
