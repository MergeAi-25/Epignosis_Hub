
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { LOCAL_STORAGE_USER_KEY } from '../constants';
import { initializeUserData as initializeStorageUserData } from '../services/dataService'; // Renamed to avoid conflict

interface UserContextType {
  currentUser: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        setCurrentUser(user);
        initializeStorageUserData(user.id); // Ensure their data store is initialized
      }
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = (name: string, email: string) => {
    if (!name.trim() || !email.trim()) {
        // Basic validation, can be enhanced
        console.error("Name and email cannot be empty for login.");
        return;
    }
    // Use email as a simple unique ID for this frontend-only system
    // In a real app, ID would come from backend.
    // Simple hash of email or just email itself can be used if it's guaranteed unique for the context.
    // For simplicity here, using a timestamp combined with email might be okay for mock uniqueness.
    // However, if a user "logs in" with the same email, we should probably retrieve their existing ID.
    // Let's check if a user with this email already exists to maintain consistency with localStorage keying for UserData.

    let userId = `user_${email.toLowerCase().replace(/[^a-z0-9]/gi, '')}_${Date.now().toString(36)}`;
    
    // Attempt to find if user with this email has logged in before to reuse ID for data consistency
    // This is a simplified approach. A robust system would handle this differently.
    const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (storedUser) {
        try {
            const existingUser: User = JSON.parse(storedUser);
            if (existingUser.email.toLowerCase() === email.toLowerCase()) {
                userId = existingUser.id; // Reuse existing ID
            }
        } catch (e) { console.error("Error parsing existing user for ID reuse", e); }
    }


    const user: User = { id: userId, name, email };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    setCurrentUser(user);
    initializeStorageUserData(user.id); 
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    // We keep LOCAL_STORAGE_USER_DATA_KEY associated with the user's ID 
    // so if they log back in with the same email (and we can reconstruct the ID or a similar key), 
    // their progress could be "restored".
    // For a truly clean logout for a new user, one might also clear specific user data,
    // but the current design links data to user ID.
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
