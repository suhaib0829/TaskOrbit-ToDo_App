import { firebaseConfig, USE_MOCK_AUTH } from '../constants';

type AuthCallback = (user: any) => void;
let mockObservers: AuthCallback[] = [];

const notifyObservers = (user: any) => {
  // Iterate over a copy to avoid mutation issues if observers unsubscribe during execution
  [...mockObservers].forEach(callback => callback(user));
};

export const AuthService = {
  login: async (email: string, pass: string) => {
    if (USE_MOCK_AUTH) {
      await new Promise(r => setTimeout(r, 1000));
      if (email === 'fail@test.com') throw { code: 'auth/user-not-found', message: 'User not found' };
      
      const user = { uid: 'demo-user', email };
      localStorage.setItem('mock_session', JSON.stringify(user));
      
      notifyObservers(user);
      return { user };
    }
    throw new Error("Firebase SDK missing.");
  },

  register: async (email: string, pass: string) => {
    if (USE_MOCK_AUTH) {
      await new Promise(r => setTimeout(r, 1500));
      
      const uid = 'user-' + Math.random().toString(36).substr(2, 9);
      const user = { uid, email };
      
      localStorage.setItem('mock_session', JSON.stringify(user));
      notifyObservers(user);
      return { user };
    }
    throw new Error("Firebase SDK missing.");
  },

  logout: async () => {
    if (USE_MOCK_AUTH) {
      // Small delay for realism, but fast enough to feel responsive
      await new Promise(r => setTimeout(r, 200));
      localStorage.removeItem('mock_session');
      // Force null update
      notifyObservers(null);
      return;
    }
    throw new Error("Firebase SDK missing.");
  },

  resetPassword: async (email: string) => {
    if (USE_MOCK_AUTH) {
       await new Promise(r => setTimeout(r, 1000));
       return;
    }
    throw new Error("Firebase SDK missing.");
  },

  onStateChanged: (callback: (user: any) => void) => {
    if (USE_MOCK_AUTH) {
      const session = localStorage.getItem('mock_session');
      const user = session ? JSON.parse(session) : null;
      callback(user);
      
      mockObservers.push(callback);
      return () => {
        mockObservers = mockObservers.filter(cb => cb !== callback);
      };
    }
    throw new Error("Firebase SDK missing.");
  }
};

export const getFirebaseErrorMessage = (code: string) => {
  switch (code) {
    case 'auth/email-already-in-use': return 'This email is already in use.';
    case 'auth/invalid-email': return 'Please enter a valid email.';
    case 'auth/weak-password': return 'Password should be at least 6 characters.';
    case 'auth/user-not-found': return 'Email or password is incorrect.';
    case 'auth/wrong-password': return 'Email or password is incorrect.';
    case 'auth/too-many-requests': return 'Too many attempts. Try again later.';
    default: return 'An unexpected error occurred.';
  }
};