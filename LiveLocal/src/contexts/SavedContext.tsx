// ============================================
// LiveLocal - Saved Places Context
// ============================================
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SavedPlace } from '../types';

interface SavedContextType {
  savedPlaces: SavedPlace[];
  isSaved: (targetId: string) => boolean;
  toggleSave: (userId: string, targetId: string, targetType: 'spot' | 'restaurant') => void;
  removeSaved: (targetId: string) => void;
  getSavedByUser: (userId: string) => SavedPlace[];
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export function SavedProvider({ children }: { children: ReactNode }) {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  const isSaved = (targetId: string) => {
    return savedPlaces.some((sp) => sp.targetId === targetId);
  };

  const toggleSave = (userId: string, targetId: string, targetType: 'spot' | 'restaurant') => {
    if (isSaved(targetId)) {
      setSavedPlaces((prev) => prev.filter((sp) => sp.targetId !== targetId));
    } else {
      const newSaved: SavedPlace = {
        id: `saved-${Date.now()}`,
        userId,
        targetId,
        targetType,
        savedAt: new Date().toISOString(),
      };
      setSavedPlaces((prev) => [...prev, newSaved]);
    }
  };

  const removeSaved = (targetId: string) => {
    setSavedPlaces((prev) => prev.filter((sp) => sp.targetId !== targetId));
  };

  const getSavedByUser = (userId: string) => {
    return savedPlaces.filter((sp) => sp.userId === userId);
  };

  return (
    <SavedContext.Provider
      value={{ savedPlaces, isSaved, toggleSave, removeSaved, getSavedByUser }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used within SavedProvider');
  return ctx;
}
