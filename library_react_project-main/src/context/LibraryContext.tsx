import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export type ReadingStatus = "to-read" | "read";

export interface BookInfo {
  id: string;
  title: string;
  author?: string;
  coverId?: number;
}

interface LibraryContextType {
  favorites: Record<string, BookInfo>;
  readingStatus: Record<string, ReadingStatus>;
  toggleFavorite: (book: BookInfo) => void;
  isFavorite: (id: string) => boolean;
  setReadingStatus: (id: string, status: ReadingStatus | null) => void;
  getReadingStatus: (id: string) => ReadingStatus | null;
}

const LibraryContext = createContext<LibraryContextType | null>(null);

// Helpers pour localStorage
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = <T,>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Provider
export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Record<string, BookInfo>>(() =>
    loadFromStorage("library_favorites", {})
  );
  const [readingStatus, setReadingStatusState] = useState<Record<string, ReadingStatus>>(() =>
    loadFromStorage("library_reading_status", {})
  );

  // Synchronise avec localStorage à chaque changement
  useEffect(() => {
    saveToStorage("library_favorites", favorites);
  }, [favorites]);

  useEffect(() => {
    saveToStorage("library_reading_status", readingStatus);
  }, [readingStatus]);

  const toggleFavorite = (book: BookInfo) => {
    setFavorites((prev) => {
      if (prev[book.id]) {
        const next = { ...prev };
        delete next[book.id];
        return next;
      }
      return { ...prev, [book.id]: book };
    });
  };

  const isFavorite = (id: string) => !!favorites[id];

  const setReadingStatus = (id: string, status: ReadingStatus | null) => {
    setReadingStatusState((prev) => {
      const next = { ...prev };
      if (status === null) {
        delete next[id];
      } else {
        next[id] = status;
      }
      return next;
    });
  };

  const getReadingStatus = (id: string): ReadingStatus | null =>
    readingStatus[id] ?? null;

  return (
    <LibraryContext.Provider
      value={{ favorites, readingStatus, toggleFavorite, isFavorite, setReadingStatus, getReadingStatus }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

// Hook personnalisé
export const useLibrary = (): LibraryContextType => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
};
