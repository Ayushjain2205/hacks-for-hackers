import React, { createContext, useContext, useState, useCallback } from "react";
import { Collection, Version, apiService } from "@/lib/api";

interface AppContextType {
  collections: Collection[];
  currentCollection: Collection | null;
  loading: boolean;
  error: string | null;
  fetchCollections: () => Promise<void>;
  createCollection: (data: any) => Promise<void>;
  createVersion: (data: any) => Promise<void>;
  setCurrentCollection: (collection: Collection | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCollections();
      setCollections(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch collections"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createCollection = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const newCollection = await apiService.createCollection(data);
      setCollections((prev) => [...prev, newCollection]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create collection"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createVersion = useCallback(
    async (data: any) => {
      try {
        setLoading(true);
        setError(null);
        const { version } = await apiService.createVersion(data);

        // Update the collections state with the new version
        if (currentCollection) {
          const updatedCollection = {
            ...currentCollection,
            variations: currentCollection.variations.map((variation) =>
              variation.id === data.variationId
                ? { ...variation, versions: [...variation.versions, version] }
                : variation
            ),
          };
          setCurrentCollection(updatedCollection);
          setCollections((prev) =>
            prev.map((collection) =>
              collection.id === currentCollection.id
                ? updatedCollection
                : collection
            )
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create version"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentCollection]
  );

  const value = {
    collections,
    currentCollection,
    loading,
    error,
    fetchCollections,
    createCollection,
    createVersion,
    setCurrentCollection,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
